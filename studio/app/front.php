<?php

declare(strict_types=1);

require __DIR__ . '/lib.php';
require __DIR__ . '/view.php';

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$path = request_path();

if (preg_match('#^/api/media/([\w.-]+)$#', $path, $match) === 1) {
    if ($method !== 'GET' && $method !== 'HEAD') {
        http_response_code(405);
        header('Allow: GET, HEAD');
        exit;
    }
    serve_media($match[1]);
}

if ($path === '/robots.txt') {
    render_robots();
    exit;
}

if ($path === '/sitemap.xml') {
    render_sitemap();
    exit;
}

if ($path === '/admin' || str_starts_with($path, '/admin/')) {
    require __DIR__ . '/admin.php';
    handle_admin($method, $path);
    exit;
}

$segments = $path === '/' ? [] : explode('/', trim($path, '/'));
$first = $segments[0] ?? '';

if (!is_locale($first)) {
    $locale = preferred_locale();
    $target = '/' . $locale . ($path === '/' ? '' : $path);
    $query = $_GET;
    unset($query['choose']);
    if ($query) {
        $target .= '?' . http_build_query($query);
    }
    redirect($target);
}

if (($_GET['choose'] ?? '') === '1' && !is_bot()) {
    set_lang_cookie($first);
    $query = $_GET;
    unset($query['choose']);
    redirect($path . ($query ? '?' . http_build_query($query) : ''));
}

render_public($first, array_slice($segments, 1), $method);
