<?php

declare(strict_types=1);

function handle_admin(string $method, string $path): void
{
    if ($path === '/admin/logout' && $method === 'POST') {
        clear_admin_cookie();
        redirect('/admin');
    }

    if ($path === '/admin/login' && $method === 'POST') {
        $password = (string) ($_POST['password'] ?? '');
        if (!password_matches($password)) {
            admin_page('login', 'That password does not match.');
            return;
        }
        set_admin_cookie();
        redirect('/admin?tab=settings&notice=signed-in');
    }

    if (!is_admin()) {
        admin_page('login', '');
        return;
    }

    if ($method === 'POST') {
        try {
            admin_post($path);
        } catch (Throwable $error) {
            $tab = admin_tab();
            redirect('/admin?tab=' . rawurlencode($tab) . '&error=' . rawurlencode($error->getMessage()));
        }
    }

    admin_page(admin_tab(), '');
}

function admin_tab(): string
{
    $tab = (string) ($_GET['tab'] ?? $_POST['tab'] ?? 'settings');
    return in_array($tab, ['settings', 'artists', 'events', 'inquiries'], true) ? $tab : 'settings';
}

function admin_post(string $path): never
{
    if (!store_can_write()) {
        throw new RuntimeException(store_write_message());
    }
    $tab = admin_tab();
    if ($path === '/admin/settings') {
        $store = store_load();
        $result = settings_from($_POST, $store['settings']);
        if (isset($result['error'])) {
            throw new RuntimeException($result['error']);
        }
        $upload = save_upload($_FILES['logo'] ?? []);
        if (isset($upload['error'])) {
            throw new RuntimeException($upload['error']);
        }
        if (isset($upload['url'])) {
            $result['settings']['logoUrl'] = $upload['url'];
            $store = store_load();
        }
        $store['settings'] = $result['settings'];
        store_save($store);
        redirect('/admin?tab=settings&notice=settings-saved');
    }
    if ($path === '/admin/artists') {
        admin_save_artist();
    }
    if ($path === '/admin/events') {
        admin_save_event();
    }
    if ($path === '/admin/inquiries') {
        $id = text_field($_POST['id'] ?? '', 80);
        $store = store_load();
        $store['inquiries'] = array_values(array_filter(
            $store['inquiries'] ?? [],
            static fn (array $item): bool => ($item['id'] ?? '') !== $id
        ));
        store_save($store);
        redirect('/admin?tab=inquiries&notice=inquiry-removed');
    }
    throw new RuntimeException('Unknown admin action.');
}

function admin_save_artist(): never
{
    $store = store_load();
    $id = text_field($_POST['id'] ?? '', 80);
    $existing = null;
    foreach ($store['artists'] as $artist) {
        if (($artist['id'] ?? '') === $id && $id !== '') {
            $existing = $artist;
            break;
        }
    }
    if (($_POST['action'] ?? '') === 'delete') {
        if (!$existing) {
            throw new RuntimeException('Choose an artist to delete.');
        }
        if (($_POST['confirm_delete'] ?? '') !== '1') {
            throw new RuntimeException('Check confirm delete before removing an artist.');
        }
        $store['artists'] = array_values(array_filter(
            $store['artists'],
            static fn (array $artist): bool => ($artist['id'] ?? '') !== $id
        ));
        store_save($store);
        redirect('/admin?tab=artists&notice=artist-removed');
    }
    $result = artist_from($_POST, $store, $existing);
    if (isset($result['error'])) {
        throw new RuntimeException($result['error']);
    }
    $upload = save_upload($_FILES['photo'] ?? []);
    if (isset($upload['error'])) {
        throw new RuntimeException($upload['error']);
    }
    if (isset($upload['url'])) {
        $result['artist']['photo'] = $upload['url'];
        if ($result['artist']['photoAlt'] === '' || str_starts_with($result['artist']['photoAlt'], 'Portrait of')) {
            $result['artist']['photoAlt'] = 'Portrait of ' . $result['artist']['name'];
        }
    }
    $dropped = array_map('strval', $_POST['portfolio_drop'] ?? []);
    $portfolio = [];
    $sources = $_POST['portfolio_src'] ?? [];
    $alts = $_POST['portfolio_alt'] ?? [];
    $captions = $_POST['portfolio_caption'] ?? [];
    $ids = $_POST['portfolio_id'] ?? [];
    if (is_array($sources)) {
        foreach (array_values($sources) as $index => $src) {
            if (in_array((string) $index, $dropped, true)) {
                continue;
            }
            $source = text_field($src, 400);
            if (!str_starts_with($source, '/')) {
                continue;
            }
            $caption = text_field($captions[$index] ?? '', 180);
            $portfolio[] = [
                'id' => text_field($ids[$index] ?? '', 80) ?: bin2hex(random_bytes(8)),
                'src' => $source,
                'alt' => text_field($alts[$index] ?? '', 240) ?: ($caption ?: 'Portfolio image'),
                'caption' => $caption,
            ];
        }
    }
    foreach (uploaded_list('portfolio') as $file) {
        $added = save_upload($file);
        if (!empty($added['empty'])) {
            continue;
        }
        if (isset($added['error'])) {
            throw new RuntimeException($added['error']);
        }
        $caption = text_field(pathinfo((string) ($file['name'] ?? ''), PATHINFO_FILENAME), 180);
        $portfolio[] = [
            'id' => bin2hex(random_bytes(8)),
            'src' => $added['url'],
            'alt' => $caption !== '' ? $caption : 'Portfolio image',
            'caption' => $caption,
        ];
    }
    $result['artist']['portfolio'] = array_slice($portfolio, 0, 24);
    $store = store_load();
    $replaced = false;
    foreach ($store['artists'] as $index => $artist) {
        if (($artist['id'] ?? '') === $result['artist']['id']) {
            $store['artists'][$index] = $result['artist'];
            $replaced = true;
            break;
        }
    }
    if (!$replaced) {
        $store['artists'][] = $result['artist'];
    }
    store_save($store);
    $notice = $existing ? 'artist-saved' : 'artist-added';
    redirect('/admin?tab=artists&id=' . rawurlencode($result['artist']['id']) . '&notice=' . $notice);
}

function admin_save_event(): never
{
    $store = store_load();
    $id = text_field($_POST['id'] ?? '', 80);
    $existing = null;
    foreach ($store['events'] as $event) {
        if (($event['id'] ?? '') === $id && $id !== '') {
            $existing = $event;
            break;
        }
    }
    if (($_POST['action'] ?? '') === 'delete') {
        if (!$existing) {
            throw new RuntimeException('Choose an event to delete.');
        }
        if (($_POST['confirm_delete'] ?? '') !== '1') {
            throw new RuntimeException('Check confirm delete before removing an event.');
        }
        $store['events'] = array_values(array_filter(
            $store['events'],
            static fn (array $event): bool => ($event['id'] ?? '') !== $id
        ));
        store_save($store);
        redirect('/admin?tab=events&notice=event-removed');
    }
    $result = event_from($_POST, $store, $existing);
    if (isset($result['error'])) {
        throw new RuntimeException($result['error']);
    }
    $upload = save_upload($_FILES['image'] ?? []);
    if (isset($upload['error'])) {
        throw new RuntimeException($upload['error']);
    }
    if (isset($upload['url'])) {
        $result['event']['image'] = $upload['url'];
        if ($result['event']['imageAlt'] === '') {
            $result['event']['imageAlt'] = $result['event']['title'];
        }
    }
    $store = store_load();
    $replaced = false;
    foreach ($store['events'] as $index => $event) {
        if (($event['id'] ?? '') === $result['event']['id']) {
            $store['events'][$index] = $result['event'];
            $replaced = true;
            break;
        }
    }
    if (!$replaced) {
        $store['events'][] = $result['event'];
    }
    store_save($store);
    $notice = $existing ? 'event-saved' : 'event-added';
    redirect('/admin?tab=events&id=' . rawurlencode($result['event']['id']) . '&notice=' . $notice);
}

function uploaded_list(string $key): array
{
    if (!isset($_FILES[$key]) || !is_array($_FILES[$key])) {
        return [];
    }
    $bag = $_FILES[$key];
    if (!is_array($bag['name'] ?? null)) {
        return [$bag];
    }
    $list = [];
    foreach ($bag['name'] as $index => $name) {
        $list[] = [
            'name' => $name,
            'type' => $bag['type'][$index] ?? '',
            'tmp_name' => $bag['tmp_name'][$index] ?? '',
            'error' => $bag['error'][$index] ?? UPLOAD_ERR_NO_FILE,
            'size' => $bag['size'][$index] ?? 0,
        ];
    }
    return $list;
}

function styles_of(mixed $value): array
{
    $raw = is_array($value) ? implode(',', $value) : text_field($value, 400);
    $parts = [];
    foreach (explode(',', $raw) as $item) {
        $item = trim($item);
        if ($item !== '') {
            $parts[] = $item;
        }
    }
    return array_slice($parts, 0, 8);
}

function artist_from(array $input, array $store, ?array $existing): array
{
    $name = text_field($input['name'] ?? '', 120);
    $blurb = text_field($input['blurb'] ?? '', 600);
    $history = text_field($input['history'] ?? '', 8000);
    $styles = styles_of($input['styles'] ?? '');
    if (mb_strlen($name) < 2) {
        return ['error' => 'Name is required.'];
    }
    if ($styles === []) {
        return ['error' => 'Add at least one style specialty.'];
    }
    if (mb_strlen($blurb) < 12) {
        return ['error' => 'Add a short blurb.'];
    }
    if (mb_strlen($history) < 12) {
        return ['error' => 'Add a longer history.'];
    }
    $photo = text_field($input['photo'] ?? '', 400) ?: '/art/placeholder-portrait.svg';
    if (!str_starts_with($photo, '/')) {
        return ['error' => 'Photo must be an uploaded studio file.'];
    }
    return ['artist' => [
        'id' => $existing['id'] ?? bin2hex(random_bytes(8)),
        'slug' => $existing['slug'] ?? unique_slug($store, $name),
        'name' => $name,
        'styles' => $styles,
        'blurb' => $blurb,
        'history' => $history,
        'photo' => $photo,
        'photoAlt' => text_field($input['photoAlt'] ?? '', 240) ?: ('Portrait of ' . $name),
        'portfolio' => $existing['portfolio'] ?? [],
    ]];
}

function event_from(array $input, array $store, ?array $existing): array
{
    $title = text_field($input['title'] ?? '', 160);
    $start = text_field($input['startDate'] ?? '', 10);
    $end = text_field($input['endDate'] ?? '', 10);
    $description = text_field($input['description'] ?? '', 4000);
    if (mb_strlen($title) < 3) {
        return ['error' => 'Title is required.'];
    }
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $start)) {
        return ['error' => 'Start date is required.'];
    }
    if ($end !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $end)) {
        return ['error' => 'End date must be a date.'];
    }
    if ($end !== '' && $end < $start) {
        return ['error' => 'End date is before the start date.'];
    }
    if (mb_strlen($description) < 12) {
        return ['error' => 'Add a description.'];
    }
    $image = text_field($input['image'] ?? '', 400) ?: '/art/placeholder-portrait.svg';
    if (!str_starts_with($image, '/')) {
        return ['error' => 'Image must be an uploaded studio file.'];
    }
    return ['event' => [
        'id' => $existing['id'] ?? bin2hex(random_bytes(8)),
        'slug' => $existing['slug'] ?? unique_slug($store, $title, $existing['id'] ?? null, 'events'),
        'title' => $title,
        'startDate' => $start,
        'endDate' => $end !== '' ? $end : $start,
        'description' => $description,
        'guest' => text_field($input['guest'] ?? '', 160),
        'country' => text_field($input['country'] ?? '', 80),
        'image' => $image,
        'imageAlt' => text_field($input['imageAlt'] ?? '', 240) ?: $title,
        'featured' => isset($input['featured']),
    ]];
}

function settings_from(array $input, array $current): array
{
    $name = text_field($input['name'] ?? '', 80);
    $address = text_field($input['address'] ?? '', 300);
    $phone = text_field($input['phone'] ?? '', 40);
    $email = text_field($input['email'] ?? '', 120);
    $tagline = text_field($input['tagline'] ?? '', 180);
    if (mb_strlen($name) < 2) {
        return ['error' => 'Studio name is required.'];
    }
    if (mb_strlen($address) < 8) {
        return ['error' => 'Address is required.'];
    }
    if (mb_strlen($phone) < 6) {
        return ['error' => 'Phone is required.'];
    }
    if ($email !== '' && !preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email)) {
        return ['error' => 'Email looks incomplete.'];
    }
    $days = $input['hour_day'] ?? [];
    $hours = $input['hour_hours'] ?? [];
    $parsed = [];
    if (is_array($days) && is_array($hours)) {
        foreach (array_values($days) as $index => $day) {
            $day = text_field($day, 20);
            if ($day === '') {
                continue;
            }
            $parsed[] = ['day' => $day, 'hours' => text_field($hours[$index] ?? '', 40)];
            if (count($parsed) === 7) {
                break;
            }
        }
    }
    $latitude = isset($input['latitude']) ? (float) $input['latitude'] : $current['latitude'];
    $longitude = isset($input['longitude']) ? (float) $input['longitude'] : $current['longitude'];
    $logo = text_field($input['logoUrl'] ?? '', 400) ?: ($current['logoUrl'] ?? '');
    if ($logo !== '' && !str_starts_with($logo, '/')) {
        return ['error' => 'Logo must be an uploaded studio file.'];
    }
    return ['settings' => [
        'name' => $name,
        'tagline' => $tagline !== '' ? $tagline : ($current['tagline'] ?? ''),
        'heroLead' => text_field($input['heroLead'] ?? '', 500),
        'officialName' => text_field($input['officialName'] ?? '', 80),
        'officialNameNote' => text_field($input['officialNameNote'] ?? '', 600),
        'phone' => $phone,
        'phoneAlt' => text_field($input['phoneAlt'] ?? '', 40),
        'email' => $email,
        'address' => $address,
        'hours' => $parsed !== [] ? $parsed : ($current['hours'] ?? []),
        'latitude' => $latitude,
        'longitude' => $longitude,
        'googleBusinessUrl' => text_field($input['googleBusinessUrl'] ?? '', 300),
        'portfolioUrl' => text_field($input['portfolioUrl'] ?? '', 300),
        'instagramUrl' => text_field($input['instagramUrl'] ?? '', 300),
        'facebookUrl' => text_field($input['facebookUrl'] ?? '', 300),
        'whatsappUrl' => text_field($input['whatsappUrl'] ?? '', 300),
        'websiteUrl' => text_field($input['websiteUrl'] ?? '', 300),
        'logoUrl' => $logo,
        'about' => text_field($input['about'] ?? '', 8000),
    ]];
}

function admin_notice(): string
{
    $code = (string) ($_GET['notice'] ?? '');
    $map = [
        'signed-in' => 'Signed in.',
        'settings-saved' => 'Studio settings saved.',
        'artist-added' => 'Artist added.',
        'artist-saved' => 'Artist updated.',
        'artist-removed' => 'Artist removed.',
        'event-added' => 'Event added.',
        'event-saved' => 'Event updated.',
        'event-removed' => 'Event removed.',
        'inquiry-removed' => 'Booking request removed.',
    ];
    return $map[$code] ?? '';
}

function admin_page(string $tab, string $error): void
{
    $store = store_load();
    $settings = $store['settings'];
    $copy = messages('en');
    $posted = text_field($_GET['error'] ?? '', 400);
    if ($error === '' && $posted !== '') {
        $error = $posted;
    }
    $notice = admin_notice();
    http_response_code(200);
    header('Content-Type: text/html; charset=utf-8');
    header('X-Robots-Tag: noindex, nofollow');
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
    echo '<meta name="robots" content="noindex, nofollow">';
    echo '<title>Admin · ' . h($settings['name']) . '</title>';
    echo '<link rel="icon" href="' . h($settings['logoUrl'] ?: '/brand/favicon.png') . '">';
    echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap">';
    echo '<link rel="stylesheet" href="/studio.css">';
    echo '</head><body><div class="site-canvas"><!-- studio-php -->';
    echo site_header('en', $settings, $copy);
    echo '<main id="content">';
    if ($tab === 'login' || !is_admin()) {
        echo admin_login($error);
    } else {
        echo admin_shell($store, $tab, $error, $notice);
    }
    echo '</main>';
    echo '</div></body></html>';
}

function admin_login(string $error): string
{
    $html = '<section class="section paper"><div class="shell" style="max-width:480px"><h1>Studio admin</h1>';
    $html .= '<p>Staff sign-in. The demo password is in the studio README.</p>';
    $html .= '<form method="post" action="/admin/login">';
    $html .= '<label for="admin-password">Password<input id="admin-password" name="password" type="password" autocomplete="current-password" required></label>';
    if ($error !== '') {
        $html .= '<p class="form-error" role="alert">' . h($error) . '</p>';
    }
    if (!store_can_write()) {
        $html .= '<p class="form-error" role="status">' . h(store_write_message()) . '</p>';
    }
    return $html . '<button class="btn btn-ink" type="submit">Sign in</button></form></div></section>';
}

function admin_shell(array $store, string $tab, string $error, string $notice): string
{
    $mode = store_mode();
    $html = '<section class="section paper"><div class="shell admin-wrap"><h1>Studio admin</h1>';
    if ($mode === 'file') {
        $html .= '<p>Changes are saved in <code>data/store.json</code> and stay after a restart. Uploaded images go to <code>data/uploads</code>.</p>';
    } elseif ($mode === 'database') {
        $html .= '<p>Changes are saved in the <code>studio_document</code> database table. Uploaded images are stored with that record and served from <code>/api/media</code>.</p>';
    } else {
        $html .= '<p class="form-error" role="status">' . h(store_write_message()) . '</p>';
    }
    $html .= '<div class="tabs" role="tablist" aria-label="Admin sections">';
    foreach (['settings', 'artists', 'events', 'inquiries'] as $item) {
        $current = $item === $tab ? ' aria-current="page"' : '';
        $html .= '<a class="btn btn-ink" role="tab" href="/admin?tab=' . h($item) . '"' . $current . '>' . h(ucfirst($item)) . '</a>';
    }
    $html .= '<form method="post" action="/admin/logout" style="display:inline"><button class="btn danger" type="submit">Sign out</button></form></div>';
    if ($notice !== '') {
        $html .= '<p class="form-ok" role="status">' . h($notice) . '</p>';
    }
    if ($error !== '') {
        $html .= '<p class="form-error" role="alert">' . h($error) . '</p>';
    }
    if ($tab === 'settings') {
        $html .= admin_settings_form($store['settings']);
    } elseif ($tab === 'artists') {
        $html .= admin_artists_form($store['artists']);
    } elseif ($tab === 'events') {
        $html .= admin_events_form($store['events']);
    } else {
        $html .= admin_inquiries($store['inquiries'] ?? []);
    }
    return $html . '</div></section>';
}

function admin_field(string $id, string $label, string $name, string $value, string $type = 'text'): string
{
    return '<label for="' . h($id) . '">' . h($label) . '<input id="' . h($id) . '" name="' . h($name) . '" type="' . h($type) . '" value="' . h($value) . '"></label>';
}

function admin_settings_form(array $settings): string
{
    $html = '<form method="post" action="/admin/settings" enctype="multipart/form-data">';
    $html .= admin_field('setting-name', 'Studio name', 'name', $settings['name'] ?? '');
    $html .= admin_field('setting-tagline', 'Tagline', 'tagline', $settings['tagline'] ?? '');
    $html .= '<label for="setting-lead">Home introduction<textarea id="setting-lead" name="heroLead">' . h($settings['heroLead'] ?? '') . '</textarea></label>';
    $html .= admin_field('setting-official', 'Official name (alternate, not the site title)', 'officialName', $settings['officialName'] ?? '');
    $html .= '<label for="setting-note">Note about the official name<textarea id="setting-note" name="officialNameNote">' . h($settings['officialNameNote'] ?? '') . '</textarea></label>';
    $html .= admin_field('setting-address', 'Address', 'address', $settings['address'] ?? '');
    $html .= admin_field('setting-phone', 'Phone', 'phone', $settings['phone'] ?? '');
    $html .= admin_field('setting-phone-alt', 'Second phone', 'phoneAlt', $settings['phoneAlt'] ?? '');
    $html .= admin_field('setting-email', 'Email', 'email', $settings['email'] ?? '', 'email');
    $html .= '<div class="hours-grid">';
    foreach ($settings['hours'] ?? [] as $index => $entry) {
        $html .= '<label for="hour-day-' . $index . '">Day<input id="hour-day-' . $index . '" name="hour_day[]" value="' . h($entry['day'] ?? '') . '"></label>';
        $html .= '<label for="hour-hours-' . $index . '">Hours<input id="hour-hours-' . $index . '" name="hour_hours[]" value="' . h($entry['hours'] ?? '') . '"></label>';
    }
    $html .= '</div>';
    $html .= admin_field('setting-lat', 'Latitude', 'latitude', (string) ($settings['latitude'] ?? ''));
    $html .= admin_field('setting-lng', 'Longitude', 'longitude', (string) ($settings['longitude'] ?? ''));
    $html .= admin_field('setting-google', 'Google Business link', 'googleBusinessUrl', $settings['googleBusinessUrl'] ?? '');
    $html .= admin_field('setting-portfolio', 'Existing portfolio link', 'portfolioUrl', $settings['portfolioUrl'] ?? '');
    $html .= admin_field('setting-instagram', 'Instagram', 'instagramUrl', $settings['instagramUrl'] ?? '');
    $html .= admin_field('setting-facebook', 'Facebook', 'facebookUrl', $settings['facebookUrl'] ?? '');
    $html .= admin_field('setting-whatsapp', 'WhatsApp link', 'whatsappUrl', $settings['whatsappUrl'] ?? '');
    $html .= admin_field('setting-website', 'Existing website', 'websiteUrl', $settings['websiteUrl'] ?? '');
    $html .= '<input type="hidden" name="logoUrl" value="' . h($settings['logoUrl'] ?? '') . '">';
    $html .= '<label for="setting-logo">Replace logo<input id="setting-logo" name="logo" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"></label>';
    if (!empty($settings['logoUrl'])) {
        $html .= '<img src="' . h($settings['logoUrl']) . '" alt="" style="width:80px">';
    }
    $html .= '<label for="setting-about">Studio story<textarea id="setting-about" name="about">' . h($settings['about'] ?? '') . '</textarea></label>';
    return $html . '<button class="btn btn-ink" type="submit">Save settings</button></form>';
}

function admin_artists_form(array $artists): string
{
    $selected = text_field($_GET['id'] ?? '', 80);
    $current = null;
    foreach ($artists as $artist) {
        if (($artist['id'] ?? '') === $selected) {
            $current = $artist;
            break;
        }
    }
    $html = '<div class="admin-grid"><div>';
    $html .= '<a class="list-btn" href="/admin?tab=artists"' . ($current ? '' : ' aria-current="true"') . '>New artist</a>';
    foreach ($artists as $artist) {
        $on = $current && $current['id'] === $artist['id'] ? ' aria-current="true"' : '';
        $html .= '<a class="list-btn" href="/admin?tab=artists&amp;id=' . h($artist['id']) . '"' . $on . '>' . h($artist['name']) . '</a>';
    }
    $html .= '</div><form method="post" action="/admin/artists" enctype="multipart/form-data">';
    $html .= '<input type="hidden" name="id" value="' . h($current['id'] ?? '') . '">';
    $html .= '<input type="hidden" name="tab" value="artists">';
    $html .= '<label for="artist-name">Name<input id="artist-name" name="name" value="' . h($current['name'] ?? '') . '" required></label>';
    $html .= '<label for="artist-styles">Style specialties, separated by commas<input id="artist-styles" name="styles" value="' . h(implode(', ', $current['styles'] ?? [])) . '" required></label>';
    $html .= '<label for="artist-blurb">Short blurb<textarea id="artist-blurb" name="blurb" required>' . h($current['blurb'] ?? '') . '</textarea></label>';
    $html .= '<label for="artist-history">Longer history<textarea id="artist-history" name="history" required>' . h($current['history'] ?? '') . '</textarea></label>';
    $html .= '<input type="hidden" name="photo" value="' . h($current['photo'] ?? '') . '">';
    $html .= '<label for="artist-alt">Photo description<input id="artist-alt" name="photoAlt" value="' . h($current['photoAlt'] ?? '') . '"></label>';
    $html .= '<label for="artist-photo">Photo<input id="artist-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"></label>';
    if (!empty($current['photo'])) {
        $html .= '<img src="' . h($current['photo']) . '" alt="" style="width:120px">';
    }
    $html .= '<div class="thumb-row">';
    foreach ($current['portfolio'] ?? [] as $index => $image) {
        $html .= '<figure><img src="' . h($image['src']) . '" alt="' . h($image['alt'] ?? '') . '">';
        $html .= '<input type="hidden" name="portfolio_id[]" value="' . h($image['id'] ?? '') . '">';
        $html .= '<input type="hidden" name="portfolio_src[]" value="' . h($image['src'] ?? '') . '">';
        $html .= '<input type="hidden" name="portfolio_alt[]" value="' . h($image['alt'] ?? '') . '">';
        $html .= '<input type="hidden" name="portfolio_caption[]" value="' . h($image['caption'] ?? '') . '">';
        $html .= '<label class="check">Remove<input type="checkbox" name="portfolio_drop[]" value="' . $index . '"></label></figure>';
    }
    $html .= '</div>';
    $html .= '<label for="artist-portfolio">Add portfolio images<input id="artist-portfolio" name="portfolio[]" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" multiple></label>';
    $html .= '<button class="btn btn-ink" name="action" value="save" type="submit">' . ($current ? 'Save artist' : 'Add artist') . '</button>';
    if ($current) {
        $html .= '<label class="check" for="artist-confirm"><input id="artist-confirm" type="checkbox" name="confirm_delete" value="1"> Confirm delete</label>';
        $html .= '<button class="btn danger" name="action" value="delete" type="submit">Delete artist</button>';
    }
    return $html . '</form></div>';
}

function admin_events_form(array $events): string
{
    $selected = text_field($_GET['id'] ?? '', 80);
    $current = null;
    foreach ($events as $event) {
        if (($event['id'] ?? '') === $selected) {
            $current = $event;
            break;
        }
    }
    $html = '<div class="admin-grid"><div>';
    $html .= '<a class="list-btn" href="/admin?tab=events"' . ($current ? '' : ' aria-current="true"') . '>New event</a>';
    foreach ($events as $event) {
        $on = $current && $current['id'] === $event['id'] ? ' aria-current="true"' : '';
        $html .= '<a class="list-btn" href="/admin?tab=events&amp;id=' . h($event['id']) . '"' . $on . '>' . h($event['title']) . '</a>';
    }
    $html .= '</div><form method="post" action="/admin/events" enctype="multipart/form-data">';
    $html .= '<input type="hidden" name="id" value="' . h($current['id'] ?? '') . '">';
    $html .= '<input type="hidden" name="tab" value="events">';
    $html .= '<label for="event-title">Title<input id="event-title" name="title" value="' . h($current['title'] ?? '') . '" required></label>';
    $html .= '<label for="event-start">Start date<input id="event-start" name="startDate" type="date" value="' . h($current['startDate'] ?? '') . '" required></label>';
    $html .= '<label for="event-end">End date<input id="event-end" name="endDate" type="date" value="' . h($current['endDate'] ?? '') . '"></label>';
    $html .= admin_field('event-guest', 'Guest', 'guest', $current['guest'] ?? '');
    $html .= admin_field('event-country', 'Country', 'country', $current['country'] ?? '');
    $html .= '<label for="event-description">Description<textarea id="event-description" name="description" required>' . h($current['description'] ?? '') . '</textarea></label>';
    $checked = !empty($current['featured']) ? ' checked' : '';
    $html .= '<label class="check" for="event-featured"><input id="event-featured" name="featured" type="checkbox" value="1"' . $checked . '> Featured on the home page</label>';
    $html .= '<input type="hidden" name="image" value="' . h($current['image'] ?? '') . '">';
    $html .= '<label for="event-alt">Image description<input id="event-alt" name="imageAlt" value="' . h($current['imageAlt'] ?? '') . '"></label>';
    $html .= '<label for="event-image">Image<input id="event-image" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"></label>';
    if (!empty($current['image'])) {
        $html .= '<img src="' . h($current['image']) . '" alt="" style="width:220px">';
    }
    $html .= '<button class="btn btn-ink" name="action" value="save" type="submit">' . ($current ? 'Save event' : 'Add event') . '</button>';
    if ($current) {
        $html .= '<label class="check" for="event-confirm"><input id="event-confirm" type="checkbox" name="confirm_delete" value="1"> Confirm delete</label>';
        $html .= '<button class="btn danger" name="action" value="delete" type="submit">Delete event</button>';
    }
    return $html . '</form></div>';
}

function admin_inquiries(array $inquiries): string
{
    if ($inquiries === []) {
        return '<p>No booking requests yet.</p>';
    }
    $html = '<div class="faq-list">';
    foreach (array_reverse($inquiries) as $inquiry) {
        $html .= '<article class="panel"><h2>' . h($inquiry['name'] ?? '') . '</h2>';
        $html .= '<p>' . h($inquiry['email'] ?? '') . ' · ' . h($inquiry['phone'] ?? '') . ' · ' . h($inquiry['artist'] ?? '') . '</p>';
        $html .= '<p>' . h($inquiry['message'] ?? '') . '</p>';
        $html .= '<p class="muted">' . h($inquiry['createdAt'] ?? '') . '</p>';
        $html .= '<form method="post" action="/admin/inquiries"><input type="hidden" name="tab" value="inquiries">';
        $html .= '<input type="hidden" name="id" value="' . h($inquiry['id'] ?? '') . '">';
        $html .= '<button class="btn danger" type="submit">Delete</button></form></article>';
    }
    return $html . '</div>';
}
