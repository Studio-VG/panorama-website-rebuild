<?php

declare(strict_types=1);

function studio_root(): string
{
    return dirname(__DIR__);
}

function h(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function locales(): array
{
    return ['en', 'tr', 'de', 'ru'];
}

function is_locale(?string $value): bool
{
    return $value !== null && in_array($value, locales(), true);
}

function locale_from_country(?string $code): string
{
    $map = ['TR' => 'tr', 'RU' => 'ru', 'DE' => 'de'];
    $code = strtoupper(trim((string) $code));
    return $map[$code] ?? 'en';
}

function is_bot(): bool
{
    $agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if ($agent === '') {
        return false;
    }
    return (bool) preg_match('/bot|crawl|spider|slurp|facebookexternalhit|embedly|quora link preview|pinterest|whatsapp|telegrambot|google-inspectiontool|mediapartners|adsbot|applebot|petalbot|bytespider|gptbot|claudebot|amazonbot/i', $agent);
}

function is_production(): bool
{
    $env = getenv('VERCEL_ENV') ?: getenv('APP_ENV') ?: '';
    return $env === 'production';
}

function is_vercel(): bool
{
    $flag = getenv('VERCEL');
    return $flag === '1' || $flag === 'true';
}

function database_url(): ?string
{
    $url = getenv('DATABASE_URL');
    if (!is_string($url)) {
        return null;
    }
    $url = trim($url);
    return $url === '' ? null : $url;
}

function request_path(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = rawurldecode($path);
    if ($path !== '/' && str_ends_with($path, '/')) {
        $path = rtrim($path, '/');
    }
    return $path === '' ? '/' : $path;
}

function redirect(string $location, int $status = 302): never
{
    header('Location: ' . $location, true, $status);
    exit;
}

function site_url(): string
{
    $configured = getenv('SITE_URL');
    if (is_string($configured) && trim($configured) !== '') {
        return rtrim(trim($configured), '/');
    }
    $proto = $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '';
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $proto === 'https';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8080';
    return ($https ? 'https' : 'http') . '://' . $host;
}

function absolute_url(string $path): string
{
    if (preg_match('#^https?://#', $path)) {
        return $path;
    }
    return site_url() . ($path !== '' && $path[0] === '/' ? $path : '/' . $path);
}

function clip(string $text, int $max = 155): string
{
    $clean = trim(preg_replace('/\s+/', ' ', $text) ?? $text);
    if (mb_strlen($clean) <= $max) {
        return $clean;
    }
    $slice = mb_substr($clean, 0, $max - 1);
    $slice = preg_replace('/\s+\S*$/', '', $slice) ?? $slice;
    return $slice . '…';
}

function messages(string $lang): array
{
    static $all = null;
    if ($all === null) {
        $all = json_decode((string) file_get_contents(studio_root() . '/data/messages.json'), true);
    }
    return $all[$lang];
}

function content_tables(): array
{
    static $copy = null;
    if ($copy === null) {
        $copy = json_decode((string) file_get_contents(studio_root() . '/data/copy.json'), true);
    }
    return $copy;
}

function seed_store(): array
{
    $data = json_decode((string) file_get_contents(studio_root() . '/data/store.json'), true);
    return is_array($data) ? $data : ['settings' => [], 'artists' => [], 'events' => [], 'inquiries' => [], 'locations' => []];
}

function istanbul_location(): array
{
    return [
        'id' => 'loc-istanbul',
        'name' => 'Istanbul',
        'address' => 'Asmalı Mescit Mahallesi, İstiklal Caddesi No:164, 34430 Beyoğlu/İstanbul, Türkiye',
        'mapsUrl' => 'https://maps.app.goo.gl/peS5AiSXgxieLkbs7',
        'mapQuery' => 'Asmalı Mescit Mahallesi, İstiklal Caddesi No:164, 34430 Beyoğlu/İstanbul',
    ];
}

function studio_locations(array $store): array
{
    $items = $store['locations'] ?? [];
    $clean = [];
    if (is_array($items)) {
        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }
            $name = trim((string) ($item['name'] ?? ''));
            $address = trim((string) ($item['address'] ?? ''));
            $maps = trim((string) ($item['mapsUrl'] ?? ''));
            $query = trim((string) ($item['mapQuery'] ?? ''));
            if ($name === '' || $address === '' || $maps === '' || $query === '') {
                continue;
            }
            $clean[] = [
                'id' => trim((string) ($item['id'] ?? '')) ?: bin2hex(random_bytes(8)),
                'name' => $name,
                'address' => $address,
                'mapsUrl' => $maps,
                'mapQuery' => $query,
            ];
        }
    }
    return $clean === [] ? [istanbul_location()] : $clean;
}

function with_locations(array $store): array
{
    $store['locations'] = studio_locations($store);
    return $store;
}

function map_point(string $query): ?array
{
    static $points = [];
    $key = trim($query);
    if ($key === '') {
        return null;
    }
    if (isset($points[$key])) {
        return $points[$key];
    }
    $url = 'https://maps.google.com/maps?' . http_build_query([
        'q' => $key,
        'z' => '19',
        'hl' => 'en',
        'output' => 'embed',
    ]);
    $context = stream_context_create(['http' => ['timeout' => 5, 'header' => "User-Agent: Mozilla/5.0\r\n"]]);
    $html = @file_get_contents($url, false, $context);
    if (!is_string($html) || !preg_match('/\[(-?\d+\.\d+),(-?\d+\.\d+)\]/', $html, $match)) {
        return null;
    }
    $lat = (float) $match[1];
    $lng = (float) $match[2];
    if (abs($lat) > 90 || abs($lng) > 180) {
        return null;
    }
    $points[$key] = ['lat' => $lat, 'lng' => $lng];
    return $points[$key];
}

function dark_map_document(float $lat, float $lng, int $zoom = 15): string
{
    $zoom = max(12, min(18, $zoom));
    $latJson = json_encode($lat);
    $lngJson = json_encode($lng);
    return '<!doctype html><html><head><meta charset="utf-8">'
        . '<link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">'
        . '<style>html,body,#m{margin:0;height:100%;background:#1c1c1c}'
        . '.pin{width:14px;height:14px;background:#e24b3b;border:2px solid #fff;border-radius:50%;box-sizing:border-box}'
        . '</style></head><body><div id="m"></div>'
        . '<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script><script>'
        . 'const lat=' . $latJson . ', lng=' . $lngJson . ';'
        . 'const map=new maplibregl.Map({container:"m",style:"https://tiles.openfreemap.org/styles/dark",center:[lng,lat],zoom:' . $zoom . '});'
        . 'map.on("load",()=>map.resize());'
        . 'const pin=document.createElement("div");pin.className="pin";'
        . 'new maplibregl.Marker({element:pin}).setLngLat([lng,lat]).addTo(map);'
        . '</script></body></html>';
}

function location_fold(string $value): string
{
    $value = mb_strtolower($value, 'UTF-8');
    return str_replace(['i̇', 'ı', 'ü', 'ö', 'ä', 'ß'], ['i', 'i', 'u', 'o', 'a', 'ss'], $value);
}

function location_is_place_word(string $value): bool
{
    $folded = location_fold(trim($value));
    if ($folded === '') {
        return true;
    }
    $words = ['germany', 'deutschland', 'almanya', 'германия', 'turkey', 'turkei', 'turkiye', 'турция', 'istanbul', 'стамбул', 'dusseldorf', 'дюссельдорф'];
    return in_array($folded, $words, true);
}

function location_city_key(array $place): string
{
    $hay = location_fold((string) ($place['address'] ?? '') . ' ' . (string) ($place['name'] ?? ''));
    if (preg_match('/dusseldorf|дюссельдорф/u', $hay)) {
        return 'dusseldorf';
    }
    if (preg_match('/istanbul|стамбул/u', $hay)) {
        return 'istanbul';
    }
    return '';
}

function location_venue_label(string $name): string
{
    $name = trim($name);
    if (location_is_place_word($name)) {
        return '';
    }
    $label = preg_replace('/\s+[-–—]\s+.*$/u', '', $name) ?? $name;
    $label = preg_replace('/\s+by\s+\S+$/iu', '', $label) ?? $label;
    $label = preg_replace('/\b(düsseldorf|dusseldorf|duesseldorf|istanbul|i̇stanbul|ıstanbul|germany|deutschland|almanya|türkiye|turkey|türkei)\b/iu', '', $label) ?? $label;
    $label = trim((string) preg_replace('/\s+/u', ' ', $label));
    $label = trim($label, " ,.-–—");
    if (preg_match('/^(.+?)\s+hotel$/iu', $label, $match)) {
        $label = trim($match[1]);
    }
    return location_is_place_word($label) ? '' : $label;
}

function location_service_groups(array $locations, array $labels): array
{
    $known = [
        'istanbul' => (string) ($labels['istanbul'] ?? 'Istanbul'),
        'dusseldorf' => (string) ($labels['dusseldorf'] ?? 'Düsseldorf'),
    ];
    $groups = [];
    $index = [];
    foreach ($locations as $place) {
        $key = location_city_key($place);
        $name = trim((string) ($place['name'] ?? ''));
        $label = $key !== '' ? $known[$key] : $name;
        if ($key === '' && location_is_place_word($label)) {
            continue;
        }
        $groupKey = $key !== '' ? $key : location_fold($label);
        if (!isset($index[$groupKey])) {
            $index[$groupKey] = count($groups);
            $groups[] = ['key' => $groupKey, 'label' => $label, 'venues' => []];
        }
        if ($key === '') {
            continue;
        }
        $venue = location_venue_label($name);
        if ($venue !== '' && !in_array($venue, $groups[$index[$groupKey]]['venues'], true)) {
            $groups[$index[$groupKey]]['venues'][] = $venue;
        }
    }
    return $groups;
}

function store_mode(): string
{
    if (!is_vercel()) {
        return 'file';
    }
    return database_url() ? 'database' : 'readonly';
}

function store_problem(): ?string
{
    return $GLOBALS['store_problem'] ?? null;
}

function store_can_write(): bool
{
    if (store_problem() !== null && store_mode() === 'database') {
        return false;
    }
    return store_mode() !== 'readonly';
}

function store_write_message(): string
{
    if (store_mode() === 'readonly') {
        return 'Saves need a database. Set DATABASE_URL to a Postgres or MySQL URL. This Vercel deployment shows the seeded studio data, and the filesystem cannot keep admin edits.';
    }
    $problem = store_problem();
    if ($problem) {
        return 'The database could not be used, so this page is showing the seeded data. ' . $problem;
    }
    return 'The studio data could not be saved.';
}

function store_load(): array
{
    $slot = &store_cache_slot();
    if ($slot !== null) {
        $slot = with_locations($slot);
        return $slot;
    }
    $mode = store_mode();
    if ($mode === 'database') {
        try {
            $loaded = db_load();
        } catch (Throwable $error) {
            $GLOBALS['store_problem'] = $error->getMessage();
            $loaded = seed_store();
        }
    } elseif ($mode === 'file') {
        $loaded = file_load();
    } else {
        $loaded = seed_store();
    }
    $slot = with_locations(with_event_slugs($loaded));
    return $slot;
}

function store_save(array $store): void
{
    if (!store_can_write()) {
        throw new RuntimeException(store_write_message());
    }
    unset($store['settings']['__ready']);
    if (store_mode() === 'database' && store_problem() === null) {
        db_save($store);
    } elseif (store_mode() === 'file') {
        file_save($store);
    } else {
        throw new RuntimeException(store_write_message());
    }
    $GLOBALS['studio_store'] = with_event_slugs($store);
    // Refresh the static cache by resetting through a dedicated holder.
    store_replace_cache($store);
}

function store_replace_cache(array $store): void
{
    $ref = &store_cache_slot();
    $ref = with_event_slugs($store);
}

function &store_cache_slot(): ?array
{
    static $store = null;
    return $store;
}

function file_load(): array
{
    $file = studio_root() . '/data/store.json';
    if (!is_file($file)) {
        return seed_store();
    }
    $data = json_decode((string) file_get_contents($file), true);
    return is_array($data) ? $data : seed_store();
}

function file_save(array $store): void
{
    $file = studio_root() . '/data/store.json';
    $json = json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $tmp = $file . '.tmp';
    if (file_put_contents($tmp, $json . "\n") === false) {
        throw new RuntimeException('Could not write the studio data file.');
    }
    if (!rename($tmp, $file)) {
        throw new RuntimeException('Could not replace the studio data file.');
    }
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $url = database_url();
    if ($url === null) {
        throw new RuntimeException('DATABASE_URL is not set.');
    }
    $parts = parse_url($url);
    if ($parts === false || empty($parts['scheme']) || empty($parts['host'])) {
        throw new RuntimeException('DATABASE_URL is not a postgres or mysql URL.');
    }
    $scheme = strtolower($parts['scheme']);
    $user = rawurldecode($parts['user'] ?? '');
    $pass = rawurldecode($parts['pass'] ?? '');
    $host = $parts['host'];
    $port = $parts['port'] ?? null;
    $db = ltrim($parts['path'] ?? '', '/');
    $query = [];
    if (!empty($parts['query'])) {
        parse_str($parts['query'], $query);
    }
    if ($scheme === 'postgres' || $scheme === 'postgresql') {
        if (!in_array('pgsql', PDO::getAvailableDrivers(), true)) {
            throw new RuntimeException('This PHP build does not include pdo_pgsql.');
        }
        $dsn = "pgsql:host={$host};dbname={$db}";
        if ($port) {
            $dsn .= ";port={$port}";
        }
        if (!empty($query['sslmode'])) {
            $dsn .= ';sslmode=' . $query['sslmode'];
        }
    } elseif ($scheme === 'mysql' || $scheme === 'mysql2') {
        if (!in_array('mysql', PDO::getAvailableDrivers(), true)) {
            throw new RuntimeException('This PHP build does not include pdo_mysql.');
        }
        $dsn = "mysql:host={$host};dbname={$db};charset=utf8mb4";
        if ($port) {
            $dsn .= ";port={$port}";
        }
    } else {
        throw new RuntimeException('DATABASE_URL must start with postgres:// or mysql://.');
    }
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

function db_migrate(PDO $pdo): void
{
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    if ($driver === 'pgsql') {
        $pdo->exec("CREATE TABLE IF NOT EXISTS studio_document (id TEXT PRIMARY KEY, body TEXT NOT NULL)");
        return;
    }
    $pdo->exec("CREATE TABLE IF NOT EXISTS studio_document (id VARCHAR(32) PRIMARY KEY, body LONGTEXT NOT NULL)");
}

function db_load(): array
{
    $pdo = db();
    db_migrate($pdo);
    $stmt = $pdo->query("SELECT body FROM studio_document WHERE id = 'store'");
    $body = $stmt ? $stmt->fetchColumn() : false;
    if (!$body) {
        $seed = seed_store();
        db_save($seed);
        return $seed;
    }
    $data = json_decode((string) $body, true);
    if (!is_array($data)) {
        throw new RuntimeException('Stored studio data is not valid JSON.');
    }
    return $data;
}

function db_save(array $store): void
{
    $pdo = db();
    db_migrate($pdo);
    $json = json_encode($store, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    if ($driver === 'pgsql') {
        $stmt = $pdo->prepare("INSERT INTO studio_document (id, body) VALUES ('store', :body) ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body");
    } else {
        $stmt = $pdo->prepare("INSERT INTO studio_document (id, body) VALUES ('store', :body) ON DUPLICATE KEY UPDATE body = VALUES(body)");
    }
    $stmt->execute(['body' => $json]);
}

function with_event_slugs(array $store): array
{
    $used = [];
    $events = [];
    foreach ($store['events'] ?? [] as $event) {
        $slug = $event['slug'] ?? slugify($event['title'] ?? 'event');
        $base = $slug;
        $n = 2;
        while (isset($used[$slug])) {
            $slug = $base . '-' . $n;
            $n++;
        }
        $used[$slug] = true;
        $event['slug'] = $slug;
        $events[] = $event;
    }
    $store['events'] = $events;
    return $store;
}

function public_store(): array
{
    $store = store_load();
    unset($store['files']);
    return $store;
}

function slugify(string $input): string
{
    $map = ['ı' => 'i', 'İ' => 'i', 'ş' => 's', 'Ş' => 's', 'ğ' => 'g', 'Ğ' => 'g', 'ü' => 'u', 'Ü' => 'u', 'ö' => 'o', 'Ö' => 'o', 'ç' => 'c', 'Ç' => 'c'];
    $replaced = strtr($input, $map);
    $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $replaced) ?: $replaced) ?? '', '-'));
    $slug = substr($slug, 0, 60);
    return $slug !== '' ? $slug : 'artist';
}

function text_field(mixed $value, int $max): string
{
    if (!is_string($value)) {
        return '';
    }
    return mb_substr(trim($value), 0, $max);
}

function unique_slug(array $store, string $name, ?string $ignoreId = null, string $bucket = 'artists'): string
{
    $base = slugify($name);
    $slug = $base;
    $n = 2;
    $taken = static function (string $candidate) use ($store, $ignoreId, $bucket): bool {
        foreach ($store[$bucket] ?? [] as $item) {
            if (($item['slug'] ?? '') === $candidate && ($item['id'] ?? '') !== $ignoreId) {
                return true;
            }
        }
        return false;
    };
    while ($taken($slug)) {
        $slug = $base . '-' . $n;
        $n++;
    }
    return $slug;
}

function localize_settings(array $settings, string $lang): array
{
    $copy = content_tables()['studioCopy'][$lang] ?? null;
    if (!$copy || $lang === 'en') {
        return $settings;
    }
    $settings['tagline'] = $copy['tagline'];
    $settings['heroLead'] = $copy['heroLead'];
    $settings['about'] = $copy['about'];
    $settings['officialNameNote'] = $copy['note'];
    return $settings;
}

function artist_is_localized(array $artist, string $lang): bool
{
    if ($lang === 'en') {
        return true;
    }
    return isset(content_tables()['artists'][$artist['id']][$lang]);
}

function localize_artist(array $artist, string $lang): array
{
    $copy = content_tables()['artists'][$artist['id']][$lang] ?? null;
    if (!$copy) {
        $artist['seoTitle'] = $artist['name'];
        $artist['seoDescription'] = $artist['blurb'];
        return $artist;
    }
    $artist['styles'] = $copy['styles'];
    $artist['blurb'] = $copy['blurb'];
    $artist['history'] = $copy['history'];
    $artist['photoAlt'] = $copy['photoAlt'];
    $artist['seoTitle'] = $copy['seoTitle'];
    $artist['seoDescription'] = $copy['seoDescription'];
    $artist['portfolio'] = array_map(static function (array $image) use ($copy): array {
        $id = $image['id'] ?? '';
        $image['alt'] = $copy['alts'][$id] ?? $image['alt'];
        $image['caption'] = $copy['captions'][$id] ?? $image['caption'];
        return $image;
    }, $artist['portfolio'] ?? []);
    return $artist;
}

function localize_event(array $event, string $lang): array
{
    $copy = content_tables()['events'][$event['id']][$lang] ?? null;
    if (!$copy) {
        $event['seoDescription'] = $event['description'];
        return $event;
    }
    return array_merge($event, $copy);
}

function artist_seo(array $artist, string $lang): array
{
    if (!artist_is_localized($artist, $lang)) {
        return ['title' => $artist['name'], 'description' => $artist['name']];
    }
    if ($lang === 'en') {
        if ($artist['id'] === 'artist-vaso') {
            return ['title' => 'Irezumi', 'description' => $artist['name'] . ' tattoos irezumi and new traditional in Beyoğlu, Istanbul.'];
        }
        if ($artist['id'] === 'artist-fahriye') {
            return ['title' => 'Japanese florals', 'description' => $artist['name'] . ' works Japanese florals in Beyoğlu: peony and waves.'];
        }
        if ($artist['id'] === 'artist-ahmet') {
            return ['title' => 'Blackwork', 'description' => $artist['name'] . ' works black and grey and custom blackwork in Beyoğlu, including neck pieces.'];
        }
    }
    $view = localize_artist($artist, $lang);
    return ['title' => $view['seoTitle'], 'description' => $view['seoDescription']];
}

function format_range(string $start, string $end = '', string $lang = 'en'): string
{
    if ($start === '') {
        return '';
    }
    $finish = $end !== '' ? $end : $start;
    if (!class_exists(IntlDateFormatter::class)) {
        if ($start === $finish) {
            return $start;
        }
        return $start . ' – ' . $finish;
    }
    $locales = ['en' => 'en_GB', 'tr' => 'tr_TR', 'de' => 'de_DE', 'ru' => 'ru_RU'];
    $fmt = new IntlDateFormatter($locales[$lang] ?? 'en_GB', IntlDateFormatter::LONG, IntlDateFormatter::NONE, 'UTC');
    $startDate = new DateTimeImmutable($start . 'T12:00:00Z');
    $endDate = new DateTimeImmutable($finish . 'T12:00:00Z');
    if ($start === $finish) {
        return (string) $fmt->format($startDate);
    }
    $sameMonth = $startDate->format('Y-m') === $endDate->format('Y-m');
    if ($sameMonth) {
        return $startDate->format('j') . '–' . $fmt->format($endDate);
    }
    return $fmt->format($startDate) . ' – ' . $fmt->format($endDate);
}

function event_status(array $event): string
{
    if (empty($event['startDate'])) {
        return 'Upcoming';
    }
    $current = gmdate('Y-m-d');
    $end = $event['endDate'] ?: $event['startDate'];
    if ($current < $event['startDate']) {
        return 'Upcoming';
    }
    if ($current > $end) {
        return 'Past';
    }
    return 'Now';
}

function tel_href(string $phone): string
{
    return 'tel:' . preg_replace('/[^\d+]/', '', $phone);
}

function parse_hours(array $entry): ?array
{
    if (preg_match('/closed/i', $entry['hours'] ?? '')) {
        return null;
    }
    if (!preg_match('/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/', $entry['hours'] ?? '', $match)) {
        return null;
    }
    return ['opens' => $match[1], 'closes' => $match[2]];
}

function paragraphs(string $text): string
{
    $html = '';
    foreach (preg_split("/\n\s*\n/", trim($text)) ?: [] as $block) {
        $block = trim($block);
        if ($block !== '') {
            $html .= '<p>' . nl2br(h($block)) . '</p>';
        }
    }
    return $html;
}

function cookie_value(string $name): ?string
{
    $value = $_COOKIE[$name] ?? null;
    return is_string($value) && $value !== '' ? $value : null;
}

function preferred_locale(): string
{
    if (is_bot()) {
        return 'en';
    }
    $chosen = cookie_value('studio_lang');
    if (is_locale($chosen)) {
        return $chosen;
    }
    $country = $_SERVER['HTTP_X_VERCEL_IP_COUNTRY'] ?? ($_SERVER['HTTP_CF_IPCOUNTRY'] ?? '');
    if (is_string($country) && trim($country) !== '') {
        return locale_from_country($country);
    }
    if (!is_production()) {
        return 'en';
    }
    $ip = public_client_ip();
    if ($ip === null) {
        return 'en';
    }
    return locale_from_ip($ip);
}

function public_client_ip(): ?string
{
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    $ip = trim(explode(',', $forwarded)[0] ?? '');
    if ($ip === '') {
        $ip = trim($_SERVER['HTTP_X_REAL_IP'] ?? '');
    }
    if ($ip === '' || is_private_ip($ip)) {
        return null;
    }
    return $ip;
}

function is_private_ip(string $ip): bool
{
    return $ip === '::1'
        || $ip === 'localhost'
        || str_starts_with($ip, '127.')
        || str_starts_with($ip, '10.')
        || str_starts_with($ip, '192.168.')
        || (bool) preg_match('/^172\.(1[6-9]|2\d|3[0-1])\./', $ip);
}

function locale_from_ip(string $ip): string
{
    $context = stream_context_create(['http' => ['timeout' => 0.8]]);
    $body = @file_get_contents('https://get.geojs.io/v1/ip/country/' . rawurlencode($ip), false, $context);
    if (!is_string($body) || !preg_match('/^[A-Za-z]{2}$/', trim($body))) {
        return 'en';
    }
    return locale_from_country(trim($body));
}

function set_lang_cookie(string $lang): void
{
    setcookie('studio_lang', $lang, [
        'expires' => time() + 60 * 60 * 24 * 365,
        'path' => '/',
        'samesite' => 'Lax',
    ]);
}

function switch_locale(string $pathname, string $next): string
{
    $parts = explode('/', $pathname);
    if (is_locale($parts[1] ?? null)) {
        $parts[1] = $next;
    } else {
        array_splice($parts, 1, 0, [$next]);
    }
    $path = implode('/', $parts);
    return ($path !== '' ? $path : '/' . $next) . '?choose=1';
}

function admin_password(): string
{
    $fromEnv = getenv('ADMIN_PASSWORD');
    if (is_string($fromEnv) && trim($fromEnv) !== '') {
        return trim($fromEnv);
    }
    return 'byvaso-demo';
}

function admin_token(): string
{
    $password = admin_password();
    $secret = getenv('ADMIN_SESSION_SECRET');
    $secret = is_string($secret) && trim($secret) !== '' ? trim($secret) : $password;
    return hash_hmac('sha256', 'admin:' . $password, $secret);
}

function password_matches(string $input): bool
{
    return hash_equals(admin_password(), $input);
}

function is_admin(): bool
{
    $cookie = cookie_value('studio_admin');
    return $cookie !== null && hash_equals(admin_token(), $cookie);
}

function set_admin_cookie(): void
{
    $secure = is_production();
    setcookie('studio_admin', admin_token(), [
        'expires' => time() + 60 * 60 * 24 * 7,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => $secure,
    ]);
}

function clear_admin_cookie(): void
{
    setcookie('studio_admin', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function json_ld(array $data): string
{
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return '<script type="application/ld+json">' . str_replace('<', '\\u003c', (string) $json) . '</script>';
}

function business_json_ld(array $settings, string $lang): array
{
    $same = array_values(array_filter([
        $settings['instagramUrl'] ?? '',
        $settings['facebookUrl'] ?? '',
        $settings['websiteUrl'] ?? '',
    ]));
    $hours = [];
    foreach ($settings['hours'] ?? [] as $entry) {
        $range = parse_hours($entry);
        if (!$range) {
            continue;
        }
        $hours[] = [
            '@type' => 'OpeningHoursSpecification',
            'dayOfWeek' => $entry['day'],
            'opens' => $range['opens'],
            'closes' => $range['closes'],
        ];
    }
    return [
        '@context' => 'https://schema.org',
        '@type' => ['TattooParlor', 'LocalBusiness'],
        '@id' => site_url() . '/#studio',
        'name' => $settings['name'],
        'alternateName' => $settings['officialName'] ?: null,
        'description' => $settings['tagline'],
        'inLanguage' => $lang,
        'url' => site_url() . '/' . $lang,
        'telephone' => $settings['phone'],
        'email' => $settings['email'] ?: null,
        'image' => absolute_url($settings['logoUrl'] ?: '/brand/logo.png'),
        'address' => [
            '@type' => 'PostalAddress',
            'streetAddress' => $settings['address'],
            'addressCountry' => 'TR',
        ],
        'geo' => [
            '@type' => 'GeoCoordinates',
            'latitude' => $settings['latitude'],
            'longitude' => $settings['longitude'],
        ],
        'hasMap' => $settings['googleBusinessUrl'],
        'sameAs' => $same,
        'openingHoursSpecification' => $hours,
    ];
}

function media_types(): array
{
    return [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'webp' => 'image/webp',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
    ];
}

function serve_media(string $name): never
{
    if (!preg_match('/^[\w.-]+$/', $name)) {
        http_response_code(404);
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Not found';
        exit;
    }
    $store = store_load();
    $stored = $store['files'][$name] ?? null;
    if (is_array($stored) && isset($stored['data'])) {
        $bytes = base64_decode((string) $stored['data'], true);
        if ($bytes !== false) {
            header('Content-Type: ' . ($stored['type'] ?? 'application/octet-stream'));
            header('Cache-Control: public, max-age=31536000, immutable');
            echo $bytes;
            exit;
        }
    }
    foreach ([studio_root() . '/data/uploads/' . $name, studio_root() . '/public/media/' . $name] as $path) {
        if (!is_file($path)) {
            continue;
        }
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        header('Content-Type: ' . (media_types()[$ext] ?? 'application/octet-stream'));
        header('Cache-Control: public, max-age=31536000, immutable');
        readfile($path);
        exit;
    }
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Not found';
    exit;
}

function save_upload(array $file): array
{
    $error = $file['error'] ?? UPLOAD_ERR_NO_FILE;
    if ($error === UPLOAD_ERR_NO_FILE) {
        return ['empty' => true];
    }
    if ($error !== UPLOAD_ERR_OK) {
        return ['error' => 'The image could not be uploaded.'];
    }
    if (($file['size'] ?? 0) > 5000000) {
        return ['error' => 'Image must be under 5 MB.'];
    }
    $ext = strtolower(pathinfo((string) ($file['name'] ?? ''), PATHINFO_EXTENSION));
    if (!isset(media_types()[$ext])) {
        return ['error' => 'Use a JPEG, PNG, WebP, GIF, or SVG.'];
    }
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) ?: '';
    $allowed = array_values(media_types());
    if (!in_array($mime, $allowed, true)) {
        return ['error' => 'Use a JPEG, PNG, WebP, GIF, or SVG.'];
    }
    if (!store_can_write()) {
        return ['error' => store_write_message()];
    }
    $filename = (string) (int) round(microtime(true) * 1000) . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
    if (store_mode() === 'database') {
        $store = store_load();
        if (!isset($store['files']) || !is_array($store['files'])) {
            $store['files'] = [];
        }
        $store['files'][$filename] = [
            'type' => $mime,
            'data' => base64_encode((string) file_get_contents($file['tmp_name'])),
        ];
        store_save($store);
    } else {
        $dir = studio_root() . '/data/uploads';
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            return ['error' => 'Could not create the uploads folder.'];
        }
        if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $filename)) {
            return ['error' => 'Could not store the image.'];
        }
    }
    return ['url' => '/api/media/' . $filename];
}
