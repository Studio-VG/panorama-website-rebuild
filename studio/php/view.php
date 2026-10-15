<?php

declare(strict_types=1);

require_once __DIR__ . '/accounts.php';

function render_public(string $lang, array $rest, string $method): void
{
    $store = public_store();
    $settings = $store['settings'];
    $studio = localize_settings($settings, $lang);
    $copy = messages($lang);
    $page = $rest[0] ?? '';

    if ($page === '' && $rest === []) {
        render_home($lang, $store, $studio, $copy);
        return;
    }
    if ($page === 'guests' && count($rest) === 1) {
        render_guests($lang, $store, $copy);
        return;
    }
    if ($page === 'guests' && count($rest) === 2) {
        render_guest($lang, $store, $copy, $rest[1]);
        return;
    }
    if ($page === 'artists' && count($rest) === 1) {
        render_artists($lang, $store, $copy);
        return;
    }
    if ($page === 'artists' && count($rest) === 2) {
        render_artist($lang, $store, $copy, $rest[1]);
        return;
    }
    if ($page === 'events' && count($rest) === 1) {
        render_events($lang, $store, $copy);
        return;
    }
    if ($page === 'events' && count($rest) === 2) {
        render_event($lang, $store, $copy, $rest[1]);
        return;
    }
    if ($page === 'about' && count($rest) === 1) {
        if ($method === 'POST') {
            handle_inquiry($lang);
        }
        render_about($lang, $store, $studio, $copy);
        return;
    }
    if ($page === 'book' && count($rest) === 1) {
        if ($method === 'POST') {
            $client = client_account();
            if (!$client || empty($client['emailVerified']) || empty($client['phoneVerified'])) {
                redirect('/' . $lang . '/sign-in?next=/' . $lang . '/book');
            }
            $_POST['name'] = (string) ($client['name'] ?? '');
            $_POST['email'] = (string) ($client['email'] ?? '');
            $_POST['phone'] = (string) ($client['phone'] ?? '');
            handle_inquiry($lang);
        }
        render_book($lang, $store, $copy);
        return;
    }
    if ($page === 'register' && count($rest) === 1) {
        if ($method === 'POST') {
            handle_register($lang);
        }
        render_register($lang);
        return;
    }
    if ($page === 'sign-in' && count($rest) === 1) {
        if ($method === 'POST') {
            handle_sign_in($lang);
        }
        render_sign_in($lang);
        return;
    }
    if ($page === 'sign-out' && count($rest) === 1) {
        clear_client_cookie();
        redirect('/' . $lang);
    }
    if ($page === 'faq' && count($rest) === 1) {
        render_faq($lang, $settings, $copy);
        return;
    }
    render_not_found($lang, $copy);
}

function handle_inquiry(string $lang): never
{
    $copy = messages($lang);
    $result = inquiry_from($_POST);
    $back = request_path();
    if (isset($result['error'])) {
        redirect($back . '?inquiry_error=' . rawurlencode($result['error']));
    }
    try {
        $store = store_load();
        $store['inquiries'][] = $result['inquiry'];
        store_save($store);
        redirect($back . '?sent=1');
    } catch (Throwable $error) {
        redirect($back . '?inquiry_error=' . rawurlencode($copy['form']['error']));
    }
}

function inquiry_from(array $input): array
{
    $name = text_field($input['name'] ?? '', 120);
    $email = text_field($input['email'] ?? '', 160);
    $phone = text_field($input['phone'] ?? '', 40);
    $message = text_field($input['message'] ?? '', 4000);
    $artist = text_field($input['artist'] ?? '', 120);
    if (mb_strlen($name) < 2) {
        return ['error' => 'Name is required.'];
    }
    if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email)) {
        return ['error' => 'A valid email is required.'];
    }
    if (mb_strlen($phone) < 6) {
        return ['error' => 'A phone number is required.'];
    }
    if (mb_strlen($message) < 10) {
        return ['error' => 'Tell us a little more in the message.'];
    }
    return ['inquiry' => [
        'id' => bin2hex(random_bytes(8)),
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'artist' => $artist !== '' ? $artist : 'No preference',
        'message' => $message,
        'createdAt' => gmdate('c'),
    ]];
}

function layout(string $lang, array $meta, string $body, array $extraLd = []): void
{
    $store = public_store();
    $settings = $store['settings'];
    $studio = localize_settings($settings, $lang);
    $copy = messages($lang);
    $path = $meta['path'];
    $title = $meta['absolute'] ?? (($meta['title'] ?? $settings['name']) . ' · ' . $settings['name']);
    $description = clip($meta['description'] ?? '');
    $image = $meta['image'] ?? '/art/hero-back.jpg';
    $canonical = $path === '/' ? site_url() . '/' . $lang : site_url() . '/' . $lang . $path;
    $status = $meta['status'] ?? 200;
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html lang="' . h($lang) . '"><head><meta charset="utf-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
    if (($meta['path'] ?? '') === '/') {
        $preloadVideo = welcome_video_public($store);
        if ($preloadVideo !== '') {
            echo '<link rel="preload" as="video" href="' . h($preloadVideo) . '" fetchpriority="high">';
        }
    }
    echo '<title>' . h($title) . '</title>';
    echo '<meta name="description" content="' . h($description) . '">';
    echo '<link rel="canonical" href="' . h($canonical) . '">';
    echo '<link rel="icon" href="' . h($settings['logoUrl'] ?: '/brand/favicon.png') . '">';
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">';
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
    echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Noto+Sans+Georgian:wght@400;500;600&family=Noto+Serif+Georgian:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap">';
    echo '<link rel="stylesheet" href="/studio.css">';
    $default = $path === '/' ? site_url() . '/ka' : site_url() . '/ka' . $path;
    echo '<link rel="alternate" hreflang="x-default" href="' . h($default) . '">';
    foreach (locales() as $locale) {
        $href = $path === '/' ? site_url() . '/' . $locale : site_url() . '/' . $locale . $path;
        echo '<link rel="alternate" hreflang="' . h($locale) . '" href="' . h($href) . '">';
    }
    echo '<meta property="og:title" content="' . h($title) . '">';
    echo '<meta property="og:description" content="' . h($description) . '">';
    echo '<meta property="og:url" content="' . h($canonical) . '">';
    echo '<meta property="og:image" content="' . h(absolute_url($image)) . '">';
    echo json_ld(business_json_ld($studio, $lang, studio_locations($store), (string) ($copy['home']['facts'] ?? '')));
    foreach ($extraLd as $block) {
        echo json_ld($block);
    }
    $metaPath = (string) ($meta['path'] ?? '');
    $dark = $metaPath === '/' || preg_match('#^/(artists|events|about|register|sign-in|book)(/|$)#', $metaPath) === 1;
    $canvas = $dark ? 'site-canvas home-entry' : 'site-canvas';
    echo '</head><body><div class="' . $canvas . '">';
    echo '<!-- studio-php -->';
    echo '<a class="skip" href="#content">' . h($copy['nav']['skip']) . '</a>';
    echo site_header($lang, $settings, $copy);
    echo '<main id="content">' . $body . '</main>';
    if (!$dark) {
        echo site_footer($lang, $studio, $copy);
    }
    echo menu_script($copy);
    echo '</div></body></html>';
}

function menu_script(array $copy): string
{
    $open = json_encode($copy['nav']['menu'] ?? 'Menu', JSON_UNESCAPED_UNICODE);
    $close = json_encode($copy['nav']['close'] ?? 'Close', JSON_UNESCAPED_UNICODE);
    return '<script>(function(){const menu=document.getElementById("site-menu");const button=document.querySelector(".menu-toggle");if(!menu||!button)return;const openLabel=' . $open . ';const closeLabel=' . $close . ';function setOpen(open){menu.classList.toggle("open",open);button.setAttribute("aria-expanded",open?"true":"false");button.setAttribute("aria-label",open?closeLabel:openLabel);}button.addEventListener("click",()=>setOpen(!menu.classList.contains("open")));document.addEventListener("pointerdown",(event)=>{if(!menu.classList.contains("open"))return;const target=event.target;if(!(target instanceof Node))return;if(menu.contains(target)||button.contains(target))return;setOpen(false);});menu.addEventListener("click",(event)=>{const link=event.target.closest("a");if(link)setOpen(false);});})();</script>';
}

function site_header(string $lang, array $settings, array $copy, bool $publicNav = true): string
{
    $path = request_path();
    $links = [
        ["/$lang", $copy['nav']['home'] ?? 'Home'],
        ["/$lang/artists", $copy['nav']['artists']],
        ["/$lang/events", $copy['nav']['events']],
        ["/$lang/about", $copy['nav']['about']],
        ["/$lang/faq", $copy['nav']['faq']],
    ];
    $videoHome = $publicNav && $path === '/' . $lang;
    $plain = $publicNav && preg_match('#^/' . $lang . '/(?:artists|events|about|register|sign-in|book)(?:/.*)?$#', $path) === 1;
    $html = '<header class="site-header' . ($videoHome ? ' home-float' : ($plain ? ' menu-corner' : '')) . '"><div class="shell header-inner">';
    if ($videoHome) {
        $html .= '<div class="brand"><img src="' . h($settings['logoUrl'] ?: '/brand/logo.png') . '" alt="">';
        $html .= '<h1 class="brand-name">' . h($settings['name']) . '</h1></div>';
    } elseif (!$plain) {
        $html .= '<a class="brand" href="/' . h($lang) . '"><img src="' . h($settings['logoUrl'] ?: '/brand/logo.png') . '" alt="">';
        $html .= '<span><span class="brand-name">' . h($settings['name']) . '</span><small>' . h($copy['nav']['kicker']) . '</small></span></a>';
    }
    if ($publicNav) {
        $html .= '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="' . h($copy['nav']['menu']) . '"><span class="menu-lines" aria-hidden="true"><i></i><i></i><i></i></span></button>';
        $html .= '<ul id="site-menu" class="nav-links">';
        foreach ($links as [$href, $label]) {
            $html .= '<li><a href="' . h($href) . '">' . h($label) . '</a></li>';
        }
        $account = client_account();
        if ($account) {
            $line = str_replace('{name}', (string) ($account['name'] ?? ''), (string) ($copy['nav']['account'] ?? 'Signed in as {name}'));
            $html .= '<li class="menu-account">' . h($line) . '</li>';
            $html .= '<li><a class="btn" href="/' . h($lang) . '/sign-out">' . h($copy['nav']['signOut'] ?? 'Sign out') . '</a></li>';
        } else {
            $html .= '<li><a class="btn" href="/' . h($lang) . '/register">' . h($copy['nav']['register'] ?? 'Register') . '</a></li>';
            $html .= '<li><a class="btn" href="/' . h($lang) . '/sign-in">' . h($copy['nav']['signIn'] ?? 'Sign in') . '</a></li>';
        }
        $html .= '<li><a class="btn" href="/' . h($lang) . '/book">' . h($copy['nav']['book']) . '</a></li>';
        $html .= '<li><nav class="langs" aria-label="' . h($copy['nav']['languages']) . '">';
        foreach (locales() as $code) {
            $current = $code === $lang ? ' aria-current="page"' : '';
            $html .= '<a href="' . h(switch_locale($path, $code)) . '" hrefLang="' . h($code) . '" lang="' . h($code) . '"' . $current . '>' . h(strtoupper($code)) . '</a>';
        }
        $html .= '</nav></li></ul>';
    }
    $html .= '</div></header>';
    return $html;
}

function studio_map(string $address, string $class = 'map-frame map-compact', string $queryText = ''): string
{
    $place = trim($address) !== '' ? $address : 'Asmalı Mescit Mahallesi, İstiklal Caddesi No:164, 34430 Beyoğlu/İstanbul, Türkiye';
    $queryText = trim($queryText) !== '' ? $queryText : 'Asmalı Mescit Mahallesi, İstiklal Caddesi No:164, 34430 Beyoğlu/İstanbul';
    $point = map_point($queryText);
    if ($point) {
        return '<iframe class="' . h($class) . ' map-dark" title="' . h($place) . '" srcdoc="' . h(dark_map_document($point['lat'], $point['lng'])) . '"></iframe>';
    }
    $query = http_build_query([
        'q' => $queryText,
        'z' => '19',
        'hl' => 'en',
        'output' => 'embed',
    ]);
    return '<iframe class="' . h($class) . '" title="' . h($place) . '" src="https://maps.google.com/maps?' . h($query) . '" referrerpolicy="no-referrer-when-downgrade"></iframe>';
}

function loc_pin(): string
{
    return '<svg class="loc-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#e24b3b" d="M12 2.2c-4 0-7.2 3.1-7.2 7.1 0 5.3 7.2 12.5 7.2 12.5s7.2-7.2 7.2-12.5c0-4-3.2-7.1-7.2-7.1z"/><circle cx="12" cy="9.2" r="2.6" fill="#fff"/></svg>';
}

function site_footer(string $lang, array $settings, array $copy): string
{
    $email = 'termini@vasovasiko.com';
    $labels = $copy['footer'];
    $locations = studio_locations(store_load());
    $groups = location_service_groups($locations, $labels);
    $many = count($locations) > 1;
    $html = '<footer class="site-footer" data-lang="' . h($lang) . '"><div class="shell"><section class="location-panel" aria-label="' . h($labels['location']) . '">';
    $html .= '<h2 class="location-heading">' . loc_pin() . h($labels['location']) . '</h2><div class="location-grid' . ($many ? ' locations-many' : '') . '">';
    foreach ($locations as $place) {
        $html .= '<div class="map-card"><div class="map-stage">';
        $html .= studio_map($place['address'], 'map-frame map-card-frame', $place['mapQuery']);
        $html .= '<div class="map-pin"><span class="pin-ring" aria-hidden="true"></span><span class="pin-ring pin-ring-late" aria-hidden="true"></span>';
        $html .= '<span class="pin-badge">' . h($place['name']) . '</span></div></div>';
        $html .= '<div class="map-card-body"><address>' . h($place['address']) . '</address>';
        $html .= '<a class="map-directions" href="' . h($place['mapsUrl']) . '" target="_blank" rel="noopener noreferrer">' . h($labels['directions']) . '</a></div></div>';
    }
    $html .= '<div class="service-col"><h3>' . h($labels['serviceArea']) . '</h3><ul class="service-list">';
    foreach ($groups as $group) {
        $html .= '<li class="service-city"><span class="city-name">' . loc_pin() . h($group['label']) . '</span>';
        if ($group['venues'] !== []) {
            $html .= '<ul class="venue-list">';
            foreach ($group['venues'] as $venue) {
                $html .= '<li>' . h($venue) . '</li>';
            }
            $html .= '</ul>';
        }
        $html .= '</li>';
    }
    $html .= '</ul><h3>' . h($labels['contact']) . '</h3><div class="contact-rows">';
    $html .= '<p><svg class="loc-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.2 3.4h2.2l1.1 3.2-1.6 1a12 12 0 0 0 5.5 5.5l1-1.6 3.2 1.1v2.2c0 .8-.6 1.5-1.4 1.6A14.6 14.6 0 0 1 5.6 4.8c.1-.8.8-1.4 1.6-1.4z"/></svg><a href="' . h(tel_href($settings['phone'])) . '">' . h($settings['phone']) . '</a></p>';
    if (!empty($settings['phoneAlt'])) {
        $html .= '<p><svg class="loc-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.2 3.4h2.2l1.1 3.2-1.6 1a12 12 0 0 0 5.5 5.5l1-1.6 3.2 1.1v2.2c0 .8-.6 1.5-1.4 1.6A14.6 14.6 0 0 1 5.6 4.8c.1-.8.8-1.4 1.6-1.4z"/></svg><a href="' . h(tel_href($settings['phoneAlt'])) . '">' . h($settings['phoneAlt']) . '</a></p>';
    }
    $html .= '<p><svg class="loc-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.5 6.2h17v11.6h-17V6.2zm8.5 6.4 7-4.4H5l7 4.4z"/></svg><a href="mailto:' . h($email) . '">' . h($email) . '</a></p></div>';
    $html .= '<div class="location-social"><a href="https://www.instagram.com/vasovasiko/" target="_blank" rel="noopener noreferrer"><svg class="loc-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5zm8 1.6H8A2.9 2.9 0 0 0 5.1 8v8A2.9 2.9 0 0 0 8 18.9h8a2.9 2.9 0 0 0 2.9-2.9V8A2.9 2.9 0 0 0 16 5.1zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zm4.35-2.55a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9z"/></svg>Instagram</a>';
    $html .= '<a href="https://www.facebook.com/vasovasiko" target="_blank" rel="noopener noreferrer"><svg class="loc-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.2 20.5v-7.2h2.4l.4-2.8h-2.8V8.8c0-.8.2-1.4 1.4-1.4H17V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2h-2.4v2.8h2.4v7.1h2.9z"/></svg>Facebook</a></div></div></div>';
    $line = array_map(static fn (array $group): string => (string) $group['label'], $groups);
    $html .= '<p class="location-line">' . h(implode(' • ', $line)) . '</p></section></div>';
    $html .= '<div class="shell"><p class="footer-title">' . h($settings['name']) . '</p><p class="fine">' . h($labels['note']) . '</p></div></footer>';
    return $html;
}

function social_links(array $settings, array $copy): string
{
    $links = [
        ['Instagram', $settings['instagramUrl'] ?? ''],
        ['Facebook', $settings['facebookUrl'] ?? ''],
    ];
    $html = '<ul class="tags">';
    foreach ($links as [$label, $href]) {
        if (!$href) {
            continue;
        }
        $html .= '<li><a href="' . h($href) . '" target="_blank" rel="noopener noreferrer">' . h($label) . '<span class="sr-only"> (' . h($copy['footer']['newTab']) . ')</span></a></li>';
    }
    return $html . '</ul>';
}

function event_card(array $event, string $lang, array $statusLabels, string $heading = 'h2'): string
{
    $status = event_status($event);
    $html = '<article class="event-card"><div class="frame event-frame"><img src="' . h($event['image']) . '" alt="' . h($event['imageAlt']) . '"></div><div class="card-body">';
    $html .= '<div class="status-row"><span class="status">' . h($statusLabels[$status] ?? $status) . '</span>';
    if (!empty($event['featured'])) {
        $html .= '<span class="status">' . h($statusLabels['featured']) . '</span>';
    }
    $html .= '</div><' . $heading . '><a href="/' . h($lang) . '/events/' . h($event['slug']) . '">' . h($event['title']) . '</a></' . $heading . '>';
    $html .= '<p>' . h(format_range($event['startDate'], $event['endDate'] ?? '', $lang)) . '</p>';
    $who = array_filter([$event['guest'] ?? '', $event['country'] ?? '']);
    if ($who) {
        $html .= '<p>' . h(implode(' · ', $who)) . '</p>';
    }
    return $html . '<p>' . h($event['description']) . '</p></div></article>';
}

function inquiry_form(array $artists, array $labels, string $defaultArtist = '', ?array $client = null): string
{
    $artists = array_values(array_filter($artists, static fn (array $artist): bool => ($artist['role'] ?? 'resident') !== 'guest'));
    $error = text_field($_GET['inquiry_error'] ?? '', 240);
    $ok = isset($_GET['sent']) ? ($labels['ok'] ?? '') : '';
    $selected = $defaultArtist;
    $names = array_column($artists, 'name');
    if (!in_array($selected, $names, true)) {
        $selected = $labels['preference'];
    }
    $locked = $client !== null;
    $name = $locked ? (string) ($client['name'] ?? '') : '';
    $email = $locked ? (string) ($client['email'] ?? '') : '';
    $phone = $locked ? (string) ($client['phone'] ?? '') : '';
    $readOnly = $locked ? ' readonly' : '';
    $html = '<form class="book-form" method="post">';
    $html .= '<label for="inquiry-name">' . h($labels['name']) . '<input id="inquiry-name" name="name" autocomplete="name" required' . $readOnly . ' value="' . h($name) . '"></label>';
    $html .= '<label for="inquiry-email">' . h($labels['email']) . '<input id="inquiry-email" name="email" type="email" autocomplete="email" required' . $readOnly . ' value="' . h($email) . '"></label>';
    $html .= '<label for="inquiry-phone">' . h($labels['phone']) . '<input id="inquiry-phone" name="phone" type="tel" autocomplete="tel" required' . $readOnly . ' value="' . h($phone) . '"></label>';
    $html .= '<label for="inquiry-artist">' . h($labels['artist']) . '<select id="inquiry-artist" name="artist">';
    $html .= '<option' . ($selected === $labels['preference'] ? ' selected' : '') . '>' . h($labels['preference']) . '</option>';
    foreach ($artists as $artist) {
        $html .= '<option' . ($selected === $artist['name'] ? ' selected' : '') . '>' . h($artist['name']) . '</option>';
    }
    $html .= '</select></label>';
    $html .= '<label for="inquiry-message">' . h($labels['message']) . '<textarea id="inquiry-message" name="message" required minlength="10"></textarea></label>';
    if ($error) {
        $html .= '<p class="form-error" role="alert">' . h($error) . '</p>';
    }
    if ($ok) {
        $html .= '<p class="form-ok" role="status">' . h($ok) . '</p>';
    }
    return $html . '<button class="btn btn-ink" type="submit">' . h($labels['send']) . '</button></form>';
}

function render_home(string $lang, array $store, array $studio, array $copy): void
{
    $settings = $store['settings'];
    $video = welcome_video_public($store);
    $body = '<section class="welcome-top entry-screen' . ($video !== '' ? ' has-video' : '') . '">';
    if ($video !== '') {
        $body .= '<video class="welcome-video" src="' . h($video) . '" muted loop playsinline autoplay preload="auto" fetchpriority="high" aria-hidden="true"></video>';
        $body .= '<script>(function(){var v=document.querySelector(".welcome-video");if(!v)return;v.muted=true;var start=function(){var p=v.play();if(p&&p.catch)p.catch(function(){});};v.addEventListener("loadeddata",start);v.addEventListener("canplay",start);if(v.readyState>=2)start();})();</script>';
    }
    $body .= '<a class="scroll-cue" href="#artists" aria-label="' . h($copy['home']['artistsTitle']) . '"><span></span></a></section>';

    $order = ['vaso-vasiko' => 0, 'andrei-aivazian' => 1];
    $deeds = ['vaso-vasiko' => $copy['home']['vasoDeed'] ?? '', 'andrei-aivazian' => $copy['home']['andreiDeed'] ?? ''];
    $residents = [];
    foreach ($store['artists'] as $artist) {
        if (($artist['role'] ?? 'resident') === 'guest' || !isset($order[$artist['slug']])) {
            continue;
        }
        $residents[] = $artist;
    }
    usort($residents, static fn (array $a, array $b): int => $order[$a['slug']] <=> $order[$b['slug']]);

    $body .= '<section class="home-lower home-artists" id="artists" aria-labelledby="artists-heading">';
    $body .= '<h2 class="home-legend" id="artists-heading">' . h($copy['home']['legend'] ?? 'Meet our legendary tattoo artists:') . '</h2><div class="home-artist-grid">';
    foreach ($residents as $artist) {
        $view = localize_artist($artist, $lang);
        $text = $deeds[$artist['slug']] !== '' ? $deeds[$artist['slug']] : $view['blurb'];
        $body .= '<article><h3>' . h($view['name']) . '</h3><p>' . h($text) . '</p></article>';
    }
    $body .= '</div><p class="home-book"><a class="btn" href="/' . h($lang) . '/book">' . h($copy['nav']['book']) . '</a></p>';
    $body .= '<div class="home-facts"><div><h2>' . h($copy['footer']['location']) . '</h2><p>';
    $address = h($settings['address']);
    if (!empty($settings['googleBusinessUrl'])) {
        $body .= '<a href="' . h($settings['googleBusinessUrl']) . '">' . $address . '</a>';
    } else {
        $body .= $address;
    }
    $body .= '</p></div><div><h2>' . h($copy['footer']['contact']) . '</h2>';
    $body .= '<p><a href="' . h(tel_href((string) $settings['phone'])) . '">' . h($settings['phone']) . '</a></p>';
    if (!empty($settings['phoneAlt'])) {
        $body .= '<p><a href="' . h(tel_href((string) $settings['phoneAlt'])) . '">' . h($settings['phoneAlt']) . '</a></p>';
    }
    $body .= '<p><a href="mailto:' . h($settings['email']) . '">' . h($settings['email']) . '</a></p>';
    $body .= '<p class="home-social"><a href="' . h($settings['instagramUrl']) . '">Instagram</a>';
    $body .= '<a href="' . h($settings['facebookUrl']) . '">Facebook</a></p></div>';
    $body .= '<div><h2>' . h($copy['footer']['hours']) . '</h2><ul>';
    foreach ($settings['hours'] as $entry) {
        $hours = preg_match('/closed/i', $entry['hours']) ? $copy['closed'] : $entry['hours'];
        $body .= '<li><span>' . h($copy['days'][$entry['day']] ?? $entry['day']) . '</span><span>' . h($hours) . '</span></li>';
    }
    $body .= '</ul></div></div></section>';

    layout($lang, [
        'path' => '/',
        'absolute' => $settings['name'] . ' · ' . $copy['seo']['homeTitle'],
        'description' => $copy['seo']['homeDescription'],
        'image' => '/art/hero-back.jpg',
    ], $body);
}

function render_artists(string $lang, array $store, array $copy): void
{
    $rank = static function (array $artist): int {
        return match ($artist['slug'] ?? '') {
            'vaso-vasiko' => 0,
            'andrei-aivazian' => 1,
            default => 2,
        };
    };
    $residents = [];
    $guests = [];
    foreach ($store['artists'] as $artist) {
        if (($artist['role'] ?? 'resident') === 'guest') {
            $guests[] = $artist;
        } else {
            $residents[] = $artist;
        }
    }
    usort($residents, static fn (array $a, array $b): int => $rank($a) <=> $rank($b));
    $deeds = ['vaso-vasiko' => $copy['home']['vasoDeed'] ?? '', 'andrei-aivazian' => $copy['home']['andreiDeed'] ?? ''];
    $body = '<section class="home-lower home-artists"><h1 class="home-legend">' . h($copy['artistsPage']['title']) . '</h1><div class="home-artist-grid">';
    foreach ($residents as $artist) {
        $view = localize_artist($artist, $lang);
        $text = ($deeds[$artist['slug']] ?? '') !== '' ? $deeds[$artist['slug']] : $view['blurb'];
        $body .= '<article><h2><a href="/' . h($lang) . '/artists/' . h($artist['slug']) . '">' . h($view['name']) . '</a></h2><p>' . h($text) . '</p></article>';
    }
    $body .= '</div><section class="home-guests" id="guests" aria-labelledby="guests-heading"><h2 class="home-legend" id="guests-heading">' . h($copy['nav']['guests'] ?? 'Guests') . '</h2><div class="home-artist-grid">';
    foreach ($guests as $artist) {
        $view = localize_artist($artist, $lang);
        $body .= '<article><h3><a href="/' . h($lang) . '/guests/' . h($artist['slug']) . '">' . h($view['name']) . '</a></h3><p>' . h($view['blurb']) . '</p></article>';
    }
    $body .= '</div></section></section>';
    layout($lang, [
        'path' => '/artists',
        'title' => $copy['seo']['artistsTitle'],
        'description' => $copy['seo']['artistsDescription'],
        'image' => '/art/portrait-vaso.jpg',
    ], $body);
}

function render_guests(string $lang, array $store, array $copy): void
{
    unset($store, $copy);
    redirect('/' . $lang . '/artists#guests');
}

function render_guest(string $lang, array $store, array $copy, string $slug): void
{
    $artist = null;
    foreach ($store['artists'] as $item) {
        if ($item['slug'] === $slug && ($item['role'] ?? '') === 'guest') {
            $artist = $item;
            break;
        }
    }
    if (!$artist) {
        render_not_found($lang, $copy);
        return;
    }
    $view = localize_artist($artist, $lang);
    $body = '<article class="shell portfolio-hero"><div class="frame portrait-frame"><img src="' . h($view['photo']) . '" alt="' . h($view['photoAlt']) . '"></div><div><p class="eyebrow">' . h($copy['nav']['guests'] ?? 'Guests') . '</p><h1>' . h($view['name']) . '</h1>';
    $body .= '<p class="lede">' . h($view['blurb']) . '</p><p>' . h($view['history']) . '</p>';
    $notice = [
        'en' => 'No phone, email, Instagram, Facebook, or WhatsApp. The guest portal for editing this page and answering clients is on the Next.js site.',
        'tr' => 'Telefon, e-posta, Instagram, Facebook veya WhatsApp yok. Bu sayfayı düzenlemek ve müşterilere cevap vermek için misafir portalı Next.js sitesindedir.',
        'de' => 'Kein Telefon, keine E-Mail, kein Instagram, Facebook oder WhatsApp. Das Gastportal zum Bearbeiten dieser Seite und zum Antworten an Kunden liegt auf der Next.js-Seite.',
        'ru' => 'Нет телефона, почты, Instagram, Facebook и WhatsApp. Портал гостя, где правят эту страницу и отвечают клиентам, находится на сайте Next.js.',
        'ka' => 'არ არის ტელეფონი, ელფოსტა, Instagram, Facebook ან WhatsApp. სტუმრის პორტალი, სადაც ამ გვერდს ასწორებენ და კლიენტებს პასუხობენ, Next.js-ის საიტზეა.',
    ][$lang] ?? 'No phone, email, Instagram, Facebook, or WhatsApp. The guest portal is on the Next.js site.';
    $body .= '<p>' . h($notice) . '</p></div></article>';
    layout($lang, [
        'path' => '/guests/' . $artist['slug'],
        'title' => $view['name'],
        'description' => $view['blurb'],
    ], $body);
}

function render_artist(string $lang, array $store, array $copy, string $slug): void
{
    $artist = null;
    foreach ($store['artists'] as $item) {
        if ($item['slug'] === $slug) {
            $artist = $item;
            break;
        }
    }
    if (!$artist) {
        render_not_found($lang, $copy);
        return;
    }
    $view = localize_artist($artist, $lang);
    $localized = artist_is_localized($artist, $lang);
    $seo = artist_seo($artist, $lang);
    $settings = $store['settings'];
    $body = '<article><div class="shell portfolio-hero"><div class="frame portrait-frame"><img src="' . h($view['photo']) . '" alt="' . h($view['photoAlt']) . '"></div><div>';
    $body .= '<p class="eyebrow">' . h(implode(' · ', $view['styles'])) . '</p><h1>' . h($view['name']) . '</h1>';
    $body .= '<p class="lede">' . h($localized ? $view['blurb'] : $copy['artistPage']['untranslated']) . '</p>';
    if ($localized) {
        $body .= paragraphs($view['history']);
    }
    $guest = ($artist['role'] ?? '') === 'guest';
    if ($guest) {
        $notice = [
            'en' => 'This guest has no phone, email, or social account. The guest portal, where they edit this page and answer clients, is on the Next.js site.',
            'tr' => 'Bu misafirin telefonu, e-postası veya sosyal hesabı yok. Sayfayı düzenlediği ve müşterilere cevap verdiği portal Next.js sitesindedir.',
            'de' => 'Dieser Gast hat kein Telefon, keine E-Mail und kein soziales Konto. Das Portal, in dem die Seite bearbeitet und Kunden geantwortet wird, liegt auf der Next.js-Seite.',
            'ru' => 'У этого гостя нет телефона, почты и социальной сети. Портал, где правят страницу и отвечают клиентам, находится на сайте Next.js.',
            'ka' => 'ამ სტუმარს არ აქვს ტელეფონი, ელფოსტა ან სოციალური ანგარიში. პორტალი, სადაც გვერდს ასწორებენ და კლიენტებს პასუხობენ, Next.js-ის საიტზეა.',
        ][$lang] ?? 'This guest has no phone, email, or social account. The guest portal is on the Next.js site.';
        $body .= '<p>' . h($notice) . '</p>';
    } else {
        $body .= '<div class="actions"><a class="btn" href="/' . h($lang) . '/book?artist=' . rawurlencode($view['name']) . '">' . h($copy['artistPage']['request']) . '</a></div>';
        $body .= '<p>' . h($settings['phone']) . ' · ' . h($settings['phoneAlt'] ?? '') . ' · ' . h($settings['email']) . '</p>';
    }
    $body .= '</div></div>';
    $body .= '<section class="section" aria-labelledby="work-heading"><div class="shell"><h2 id="work-heading">' . h($copy['artistPage']['work']) . '</h2><div class="gallery">';
    foreach ($view['portfolio'] as $image) {
        $body .= '<figure><div class="frame plate-frame"><img src="' . h($image['src']) . '" alt="' . h($image['alt']) . '"></div>';
        if (!empty($image['caption'])) {
            $body .= '<figcaption>' . h($image['caption']) . '</figcaption>';
        }
        $body .= '</figure>';
    }
    $body .= '</div></div></section></article>';
    $ld = [
        '@context' => 'https://schema.org',
        '@type' => 'Person',
        'name' => $view['name'],
        'description' => $view['blurb'],
        'image' => absolute_url($view['photo']),
        'jobTitle' => 'Tattoo artist',
        'knowsAbout' => $view['styles'],
        'url' => absolute_url("/$lang/artists/" . $artist['slug']),
        'worksFor' => ['@id' => site_url() . '/#studio', '@type' => 'TattooParlor', 'name' => $settings['name'], 'telephone' => $settings['phone'], 'address' => istanbul_street($settings, studio_locations($store))],
    ];
    layout($lang, [
        'path' => '/artists/' . $artist['slug'],
        'title' => $seo['title'],
        'description' => $seo['description'],
        'image' => $view['photo'],
    ], $body, [$ld]);
}

function render_events(string $lang, array $store, array $copy): void
{
    $events = array_map(static fn (array $event): array => localize_event($event, $lang), $store['events']);
    usort($events, static fn (array $a, array $b): int => strcmp($b['startDate'], $a['startDate']));
    $body = '<section class="home-lower"><div class="shell">';
    $body .= '<h1 class="home-legend">' . h($copy['eventsPage']['title']) . '</h1><p class="home-lead">' . h($copy['eventsPage']['lead']) . '</p><div class="event-list">';
    foreach ($events as $event) {
        $body .= event_card($event, $lang, $copy['status']);
    }
    $body .= '</div></div></section>';
    layout($lang, [
        'path' => '/events',
        'title' => $copy['seo']['eventsTitle'],
        'description' => $copy['seo']['eventsDescription'],
        'image' => '/art/event-marmaris.jpg',
    ], $body);
}

function render_event(string $lang, array $store, array $copy, string $slug): void
{
    $event = null;
    foreach ($store['events'] as $item) {
        if ($item['slug'] === $slug) {
            $event = $item;
            break;
        }
    }
    if (!$event) {
        render_not_found($lang, $copy);
        return;
    }
    $view = localize_event($event, $lang);
    $settings = $store['settings'];
    $status = event_status($event);
    $body = '<article><div class="shell portfolio-hero"><div class="frame portrait-frame"><img src="' . h($view['image']) . '" alt="' . h($view['imageAlt']) . '"></div><div>';
    $body .= '<p class="eyebrow">' . h($copy['status'][$status] ?? $status) . '</p><h1>' . h($view['title']) . '</h1>';
    $body .= '<p class="lede">' . h(format_range($view['startDate'], $view['endDate'] ?? '', $lang)) . '</p>';
    $who = array_filter([$view['guest'] ?? '', $view['country'] ?? '']);
    if ($who) {
        $body .= '<p>' . h(implode(' · ', $who)) . '</p>';
    }
    $body .= '<p>' . h($view['description']) . '</p><p>' . h($settings['name']) . ' · <a href="' . h(tel_href($settings['phone'])) . '">' . h($settings['phone']) . '</a></p>';
    $street = istanbul_street($settings, studio_locations($store));
    $body .= '<address>' . h($street) . '</address><div class="actions">';
    $body .= '<a class="btn" href="/' . h($lang) . '/book">' . h($copy['eventPage']['request']) . '</a>';
    $body .= '<a class="btn btn-ghost" href="/' . h($lang) . '/events">' . h($copy['eventPage']['all']) . '</a></div></div></div>';
    $others = [];
    foreach ($store['events'] as $item) {
        if ($item['id'] !== $event['id']) {
            $others[] = localize_event($item, $lang);
        }
    }
    if ($others) {
        $body .= '<section class="section" aria-labelledby="more-events"><div class="shell"><h2 id="more-events">' . h($copy['eventPage']['other']) . '</h2><div class="event-list">';
        foreach ($others as $item) {
            $body .= event_card($item, $lang, $copy['status'], 'h3');
        }
        $body .= '</div></div></section>';
    }
    $body .= '</article>';
    $away = $event['slug'] === 'marmaris-tattoo-festival' || preg_match('/festival|convention|фестиваль/i', $event['title']);
    $ld = [
        '@context' => 'https://schema.org',
        '@type' => 'Event',
        'name' => $view['title'],
        'description' => $view['description'],
        'startDate' => $view['startDate'],
        'endDate' => $view['endDate'] ?: $view['startDate'],
        'image' => absolute_url($view['image']),
        'url' => absolute_url("/$lang/events/" . $event['slug']),
        'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
        'eventStatus' => 'https://schema.org/EventScheduled',
        'location' => $away
            ? ['@type' => 'Place', 'name' => $view['country'] ? $view['title'] . ', ' . $view['country'] : $view['title'], 'address' => $view['country'] ?: null]
            : ['@type' => 'Place', 'name' => $settings['name'], 'telephone' => $settings['phone'], 'address' => ['@type' => 'PostalAddress', 'streetAddress' => $street, 'addressCountry' => 'TR']],
        'organizer' => ['@id' => site_url() . '/#studio', '@type' => 'TattooParlor', 'name' => $settings['name'], 'telephone' => $settings['phone'], 'address' => $street],
    ];
    if (!empty($view['guest'])) {
        $ld['performer'] = ['@type' => 'Person', 'name' => $view['guest']];
    }
    layout($lang, [
        'path' => '/events/' . $event['slug'],
        'title' => $view['title'],
        'description' => $view['seoDescription'] ?? $view['description'],
        'image' => $view['image'],
    ], $body, [$ld]);
}

function render_about(string $lang, array $store, array $studio, array $copy): void
{
    $settings = $store['settings'];
    $body = '<section class="home-lower about-page"><div class="shell"><h1 class="home-legend">' . h($copy['about']['title']) . '</h1><div class="split"><div>';
    $body .= paragraphs($copy['about']['story'] ?? '');
    if (!empty($settings['officialName'])) {
        $body .= '<p class="note">' . h($copy['about']['publicName']) . ': ' . h($settings['officialName']) . '. ' . h($studio['officialNameNote']) . '</p>';
    }
    $body .= '<p>' . h($copy['home']['facts']) . '</p></div>';
    $istanbul = '';
    foreach (studio_locations($store) as $place) {
        $hay = ($place['name'] ?? '') . ' ' . ($place['address'] ?? '');
        if (preg_match('/istanbul|beyoğlu|beyoglu/iu', $hay)) {
            $istanbul = $place['address'];
            break;
        }
    }
    $body .= '<div class="reach-card"><h2>' . h($copy['about']['reach']) . ' ' . h($settings['name']) . '</h2><ul class="contact-list">';
    $body .= '<li><span>' . h($copy['about']['address']) . '</span><span>' . h($istanbul !== '' ? $istanbul : ($settings['address'] ?? '')) . '</span></li>';
    $body .= '<li><span>' . h($copy['about']['phone']) . '</span><a href="' . h(tel_href($settings['phone'])) . '">' . h($settings['phone']) . '</a></li>';
    if (!empty($settings['phoneAlt'])) {
        $body .= '<li><span>' . h($copy['about']['also']) . '</span><a href="' . h(tel_href($settings['phoneAlt'])) . '">' . h($settings['phoneAlt']) . '</a></li>';
    }
    if (!empty($settings['email'])) {
        $body .= '<li><span>' . h($copy['about']['email']) . '</span><a href="mailto:' . h($settings['email']) . '">' . h($settings['email']) . '</a></li>';
    }
    if (!empty($settings['whatsappUrl'])) {
        $body .= '<li><span>' . h($copy['about']['whatsapp']) . '</span><a href="' . h($settings['whatsappUrl']) . '">' . h($copy['about']['whatsapp']) . '</a></li>';
    }
    $body .= '</ul>' . social_links($settings, $copy) . '<h3>' . h($copy['about']['hours']) . '</h3><ul class="hours">';
    foreach ($settings['hours'] as $entry) {
        $hours = preg_match('/closed/i', $entry['hours']) ? $copy['closed'] : $entry['hours'];
        $body .= '<li><span>' . h($copy['days'][$entry['day']] ?? $entry['day']) . '</span><span>' . h($hours) . '</span></li>';
    }
    $body .= '</ul><p><a href="/' . h($lang) . '/book">' . h($copy['about']['booking']) . '</a></p></div></div>';
    $body .= '<div class="about-form">' . inquiry_form($store['artists'], $copy['form']) . '</div></div></section>';
    layout($lang, [
        'path' => '/about',
        'title' => $copy['seo']['aboutTitle'],
        'description' => $copy['seo']['aboutDescription'],
    ], $body);
}

function render_book(string $lang, array $store, array $copy): void
{
    $settings = $store['settings'];
    $artist = text_field($_GET['artist'] ?? '', 120);
    $body = '<section class="home-lower"><div class="shell split"><div>';
    $body .= '<h1 class="home-legend">' . h($copy['book']['title']) . '</h1><p>' . h($copy['book']['lead']) . '</p><p>' . h(istanbul_street($settings, studio_locations($store))) . '</p>';
    $body .= '<p><a href="mailto:' . h($settings['email']) . '">' . h($settings['email']) . '</a> · <a href="' . h($settings['whatsappUrl']) . '">' . h($copy['about']['whatsapp']) . '</a></p></div>';
    $client = client_account();
    $ready = $client && !empty($client['emailVerified']) && !empty($client['phoneVerified']);
    if ($ready) {
        $body .= inquiry_form($store['artists'], $copy['form'], $artist, $client);
    } else {
        $need = account_copy($lang)['need'];
        $body .= '<div class="book-form"><p>' . h($need) . '</p><p><a class="btn" href="/' . h($lang) . '/register?next=/' . h($lang) . '/book">' . h($copy['nav']['register'] ?? 'Register') . '</a> <a class="btn" href="/' . h($lang) . '/sign-in?next=/' . h($lang) . '/book">' . h($copy['nav']['signIn'] ?? 'Sign in') . '</a></p></div>';
    }
    $body .= '</div></section>';
    layout($lang, [
        'path' => '/book',
        'title' => $copy['seo']['bookTitle'],
        'description' => $copy['seo']['bookDescription'],
    ], $body);
}

function render_faq(string $lang, array $settings, array $copy): void
{
    $body = '<section class="section paper"><div class="shell" style="max-width:800px"><p class="kicker">' . h($settings['name']) . '</p><h1>' . h($copy['faq']['title']) . '</h1><div class="faq-list">';
    foreach ($copy['faq']['items'] as $item) {
        $body .= '<article class="panel"><h2>' . h($item['q']) . '</h2><p>' . h($item['a']) . '</p></article>';
    }
    $body .= '</div><p><a href="/' . h($lang) . '/about">' . h($copy['nav']['about']) . '</a> · <a href="/' . h($lang) . '/book">' . h($copy['nav']['book']) . '</a></p></div></section>';
    $faqLd = [
        '@context' => 'https://schema.org',
        '@type' => 'FAQPage',
        'mainEntity' => array_map(static function (array $item): array {
            return [
                '@type' => 'Question',
                'name' => $item['q'],
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $item['a']],
            ];
        }, $copy['faq']['items']),
    ];
    layout($lang, [
        'path' => '/faq',
        'title' => $copy['seo']['faqTitle'],
        'description' => $copy['seo']['faqDescription'],
    ], $body, [$faqLd]);
}

function render_not_found(string $lang, array $copy): void
{
    $body = '<section class="section"><div class="shell"><h1>' . h($copy['notFound']['title']) . '</h1><p>' . h($copy['notFound']['body']) . '</p>';
    $body .= '<a class="btn" href="/' . h($lang) . '">' . h($copy['notFound']['home']) . '</a></div></section>';
    layout($lang, [
        'path' => '/404',
        'title' => $copy['notFound']['title'],
        'description' => $copy['notFound']['body'],
        'status' => 404,
    ], $body);
}

function render_robots(): void
{
    header('Content-Type: text/plain; charset=utf-8');
    echo "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: " . site_url() . "/sitemap.xml\n";
}

function render_sitemap(): void
{
    $store = public_store();
    $paths = ['/', '/artists', '/events', '/about', '/book', '/faq'];
    foreach ($store['artists'] as $artist) {
        $paths[] = '/artists/' . $artist['slug'];
    }
    foreach ($store['events'] as $event) {
        $paths[] = '/events/' . $event['slug'];
    }
    header('Content-Type: application/xml; charset=utf-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>';
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
    foreach (locales() as $lang) {
        foreach ($paths as $path) {
            $url = $path === '/' ? site_url() . '/' . $lang : site_url() . '/' . $lang . $path;
            echo '<url><loc>' . h($url) . '</loc>';
            $xdefault = $path === '/' ? site_url() . '/ka' : site_url() . '/ka' . $path;
            echo '<xhtml:link rel="alternate" hreflang="x-default" href="' . h($xdefault) . '"/>';
            foreach (locales() as $locale) {
                $href = $path === '/' ? site_url() . '/' . $locale : site_url() . '/' . $locale . $path;
                echo '<xhtml:link rel="alternate" hreflang="' . h($locale) . '" href="' . h($href) . '"/>';
            }
            echo '</url>';
        }
    }
    echo '</urlset>';
}
