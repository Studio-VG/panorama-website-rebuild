<?php

declare(strict_types=1);

function oauth_env(string $name): string
{
    $value = getenv($name);
    return is_string($value) ? trim($value) : '';
}

function oauth_redirect_url(string $provider): string
{
    return site_url() . '/auth/' . $provider . '/callback';
}

function oauth_missing(string $provider): array
{
    if ($provider === 'google') {
        $missing = [];
        if (oauth_env('GOOGLE_CLIENT_ID') === '') {
            $missing[] = 'GOOGLE_CLIENT_ID';
        }
        if (oauth_env('GOOGLE_CLIENT_SECRET') === '') {
            $missing[] = 'GOOGLE_CLIENT_SECRET';
        }
        return $missing;
    }
    $missing = [];
    foreach (['APPLE_SERVICES_ID', 'APPLE_TEAM_ID', 'APPLE_KEY_ID', 'APPLE_PRIVATE_KEY'] as $key) {
        if (oauth_env($key) === '') {
            $missing[] = $key;
        }
    }
    return $missing;
}

function oauth_buttons(string $next): string
{
    $query = $next !== '' ? '?next=' . rawurlencode($next) : '';
    $html = '<div class="auth-providers">';
    $html .= '<a class="btn btn-provider" href="/auth/google' . $query . '">Google</a>';
    $html .= '<a class="btn btn-provider" href="/auth/apple' . $query . '">Apple</a>';
    return $html . '</div>';
}

function oauth_safe_next(string $next): string
{
    return preg_match('#^/(en|tr|de|ru|ka)(/book)?$#', $next) === 1 ? $next : '/en';
}

function handle_oauth(string $provider, bool $callback, string $method): void
{
    if (!in_array($provider, ['google', 'apple'], true)) {
        http_response_code(404);
        echo 'Not found';
        return;
    }
    $missing = oauth_missing($provider);
    if ($missing !== []) {
        oauth_blocked_page($provider, $missing);
        return;
    }
    if (!$callback) {
        oauth_start($provider);
        return;
    }
    if ($provider === 'apple' && $method !== 'POST' && $method !== 'GET') {
        http_response_code(405);
        echo 'Method not allowed';
        return;
    }
    oauth_callback($provider);
}

function oauth_start(string $provider): void
{
    $next = oauth_safe_next(text_field($_GET['next'] ?? '', 80));
    $state = rtrim(strtr(base64_encode($next), '+/', '-_'), '=');
    $redirect = rawurlencode(oauth_redirect_url($provider));
    if ($provider === 'google') {
        $url = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code'
            . '&client_id=' . rawurlencode(oauth_env('GOOGLE_CLIENT_ID'))
            . '&redirect_uri=' . $redirect
            . '&scope=' . rawurlencode('openid email profile')
            . '&state=' . rawurlencode($state);
        redirect($url);
    }
    $url = 'https://appleid.apple.com/auth/authorize?response_type=code&response_mode=form_post'
        . '&client_id=' . rawurlencode(oauth_env('APPLE_SERVICES_ID'))
        . '&redirect_uri=' . $redirect
        . '&scope=' . rawurlencode('name email')
        . '&state=' . rawurlencode($state);
    redirect($url);
}

function oauth_callback(string $provider): void
{
    $code = text_field($_POST['code'] ?? $_GET['code'] ?? '', 2048);
    if ($code === '') {
        oauth_blocked_page($provider, ['authorization code from ' . ($provider === 'google' ? 'Google' : 'Apple')]);
        return;
    }
    if ($provider === 'google') {
        oauth_google_finish($code);
        return;
    }
    oauth_blocked_page('apple', ['Apple identity token. The callback will not sign anyone in until the token is verified.']);
}

function oauth_google_finish(string $code): void
{
    $body = http_build_query([
        'code' => $code,
        'client_id' => oauth_env('GOOGLE_CLIENT_ID'),
        'client_secret' => oauth_env('GOOGLE_CLIENT_SECRET'),
        'redirect_uri' => oauth_redirect_url('google'),
        'grant_type' => 'authorization_code',
    ]);
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $body,
            'timeout' => 15,
            'ignore_errors' => true,
        ],
    ]);
    $raw = file_get_contents('https://oauth2.googleapis.com/token', false, $context);
    $token = is_string($raw) ? json_decode($raw, true) : null;
    $access = is_array($token) ? (string) ($token['access_token'] ?? '') : '';
    if ($access === '') {
        oauth_blocked_page('google', ['a valid Google token response']);
        return;
    }
    $profileContext = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "Authorization: Bearer {$access}\r\n",
            'timeout' => 15,
            'ignore_errors' => true,
        ],
    ]);
    $profileRaw = file_get_contents('https://openidconnect.googleapis.com/v1/userinfo', false, $profileContext);
    $profile = is_string($profileRaw) ? json_decode($profileRaw, true) : null;
    $email = is_array($profile) ? strtolower(trim((string) ($profile['email'] ?? ''))) : '';
    $verified = is_array($profile) && !empty($profile['email_verified']);
    if ($email === '' || !$verified || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        oauth_blocked_page('google', ['a verified Google email']);
        return;
    }
    $name = is_array($profile) ? trim((string) ($profile['name'] ?? '')) : '';
    if ($name === '') {
        $name = strstr($email, '@', true) ?: 'Google guest';
    }
    $store = store_load();
    if (!isset($store['clients']) || !is_array($store['clients'])) {
        $store['clients'] = [];
    }
    $account = null;
    foreach ($store['clients'] as $index => $client) {
        if (strtolower((string) ($client['email'] ?? '')) === $email) {
            $client['emailVerified'] = true;
            if ($name !== '') {
                $client['name'] = $name;
            }
            $store['clients'][$index] = $client;
            $account = $client;
            break;
        }
    }
    if (!$account) {
        $account = [
            'id' => bin2hex(random_bytes(16)),
            'name' => $name,
            'email' => $email,
            'phone' => '',
            'emailVerified' => true,
            'phoneVerified' => false,
            'createdAt' => gmdate('c'),
        ];
        $store['clients'][] = $account;
    }
    store_save($store);
    set_client_cookie((string) $account['id']);
    $state = text_field($_GET['state'] ?? $_POST['state'] ?? '', 200);
    $padded = strtr($state, '-_', '+/');
    $next = oauth_safe_next((string) base64_decode($padded, true));
    redirect($next);
}

function oauth_blocked_page(string $provider, array $missing): void
{
    http_response_code(503);
    header('Content-Type: text/html; charset=utf-8');
    $name = $provider === 'google' ? 'Google' : 'Apple';
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>' . h($name) . ' sign-in</title>';
    echo '<link rel="stylesheet" href="/studio.css"></head><body><div class="site-canvas home-entry">';
    echo '<main class="home-lower"><div class="shell" style="max-width:640px">';
    echo '<h1 class="home-legend">' . h($name) . ' sign-in is not configured</h1>';
    echo '<p>No account was created and nobody was signed in.</p>';
    echo '<p>Still needed: ' . h(implode(', ', $missing)) . '.</p>';
    echo '<p>Redirect URL to allow: ' . h(oauth_redirect_url($provider)) . '</p>';
    echo '<p><a href="/en/sign-in">Back to sign in</a></p>';
    echo '</div></main></div></body></html>';
}
