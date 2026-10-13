<?php

declare(strict_types=1);

function client_secret(): string
{
    $secret = getenv('ADMIN_SESSION_SECRET');
    return is_string($secret) && trim($secret) !== '' ? trim($secret) : admin_password();
}

function client_token(string $id): string
{
    return $id . '.' . hash_hmac('sha256', 'client:' . $id, client_secret());
}

function client_account(): ?array
{
    $token = cookie_value('studio_account');
    if ($token === null || !str_contains($token, '.')) {
        return null;
    }
    [$id, $sig] = explode('.', $token, 2);
    $expected = substr(client_token($id), strlen($id) + 1);
    if (!hash_equals($expected, $sig)) {
        return null;
    }
    foreach (store_load()['clients'] ?? [] as $client) {
        if (($client['id'] ?? '') === $id) {
            return $client;
        }
    }
    return null;
}

function set_client_cookie(string $id): void
{
    setcookie('studio_account', client_token($id), [
        'expires' => time() + 60 * 60 * 24 * 30,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => is_production(),
    ]);
}

function clear_client_cookie(): void
{
    setcookie('studio_account', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => is_production(),
    ]);
}

function account_copy(string $lang): array
{
    $copy = messages($lang);
    $sign = is_array($copy['signIn'] ?? null) ? $copy['signIn'] : [];
    $reg = is_array($copy['register'] ?? null) ? $copy['register'] : [];
    return [
        'signTitle' => (string) ($sign['title'] ?? $copy['nav']['signIn'] ?? 'Sign in'),
        'signLead' => (string) ($sign['lead'] ?? 'Sign in with the email or phone already on your account. There is no password. A one-time code confirms it is you.'),
        'identifier' => (string) ($sign['identifier'] ?? 'Email or phone'),
        'send' => (string) ($sign['send'] ?? 'Send code'),
        'code' => (string) ($sign['code'] ?? 'One-time code'),
        'confirm' => (string) ($sign['confirm'] ?? 'Sign in'),
        'unknown' => (string) ($sign['unknown'] ?? 'No finished account uses that email or phone.'),
        'wrong' => (string) ($sign['wrong'] ?? 'That code does not match.'),
        'expired' => (string) ($sign['expired'] ?? 'That code has expired. Ask for a new one.'),
        'error' => (string) ($sign['error'] ?? 'Enter the email or phone on the account.'),
        'regTitle' => (string) ($reg['title'] ?? $copy['nav']['register'] ?? 'Register'),
        'regLead' => (string) ($reg['lead'] ?? 'The account is created only after both codes are confirmed.'),
        'name' => (string) ($reg['name'] ?? 'Name'),
        'email' => (string) ($reg['email'] ?? 'Email'),
        'phone' => (string) ($reg['phone'] ?? 'Phone'),
        'emailCode' => (string) ($reg['emailCode'] ?? 'Email code'),
        'phoneCode' => (string) ($reg['phoneCode'] ?? 'Phone code'),
        'codesLead' => (string) ($reg['codesLead'] ?? 'Enter the email code and the phone code.'),
        'regConfirm' => (string) ($reg['confirm'] ?? 'Confirm codes'),
        'mismatch' => (string) ($reg['mismatch'] ?? 'That email already has an account with a different phone.'),
        'regError' => (string) ($reg['error'] ?? 'Check the name, email, and phone.'),
        'regWrong' => (string) ($reg['wrong'] ?? 'That code does not match.'),
        'need' => (string) ($copy['book']['needAccount'] ?? 'A booking is sent only from a signed-in client account.'),
    ];
}

function new_otp(): string
{
    return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
}

function code_hash(string $id, string $channel, string $code): string
{
    return hash_hmac('sha256', $id . ':' . $channel . ':' . $code, client_secret());
}

function digits_only(string $value): string
{
    return preg_replace('/\D+/', '', $value) ?? '';
}

function safe_next(string $lang, string $next): string
{
    return $next === '/' . $lang . '/book' ? $next : '/' . $lang;
}

function &pending_list(array &$store): array
{
    if (!isset($store['registrations']) || !is_array($store['registrations'])) {
        $store['registrations'] = [];
    }
    return $store['registrations'];
}

function save_pending(array $pending): void
{
    $store = store_load();
    $list = &pending_list($store);
    array_unshift($list, $pending);
    $store['registrations'] = array_slice($list, 0, 40);
    store_save($store);
}

function find_pending(string $id): ?array
{
    foreach (store_load()['registrations'] ?? [] as $item) {
        if (($item['id'] ?? '') === $id) {
            return $item;
        }
    }
    return null;
}

function update_pending(array $pending): void
{
    $store = store_load();
    $list = &pending_list($store);
    foreach ($list as $index => $item) {
        if (($item['id'] ?? '') === $pending['id']) {
            $list[$index] = $pending;
            $store['registrations'] = $list;
            store_save($store);
            return;
        }
    }
}

function find_client_by_contact(string $contact): ?array
{
    $email = strtolower(trim($contact));
    $phone = digits_only($contact);
    foreach (store_load()['clients'] ?? [] as $client) {
        if (strtolower((string) ($client['email'] ?? '')) === $email) {
            return $client;
        }
        if (strlen($phone) >= 6 && digits_only((string) ($client['phone'] ?? '')) === $phone) {
            return $client;
        }
    }
    return null;
}

function account_error(string $lang, string $page, string $code, string $next = ''): never
{
    $query = 'error=' . rawurlencode($code);
    if ($next !== '') {
        $query .= '&next=' . rawurlencode($next);
    }
    redirect('/' . $lang . '/' . $page . '?' . $query);
}

function render_account_page(string $lang, string $path, string $title, string $lead, string $form): void
{
    $body = '<section class="section"><div class="shell" style="max-width:640px"><h1>' . h($title) . '</h1><p>' . h($lead) . '</p>' . $form . '</div></section>';
    layout($lang, [
        'path' => $path,
        'title' => $title,
        'description' => $lead,
    ], $body);
}

function render_sign_in(string $lang): void
{
    $copy = account_copy($lang);
    $client = client_account();
    if ($client) {
        render_account_page($lang, '/sign-in', $copy['signTitle'], $copy['signLead'], '<p>' . h(str_replace('{name}', (string) $client['name'], messages($lang)['nav']['account'] ?? $client['name'])) . '</p>');
        return;
    }
    $error = text_field($_GET['error'] ?? '', 40);
    $next = safe_next($lang, text_field($_GET['next'] ?? '', 80));
    $id = text_field($_GET['id'] ?? '', 80);
    $note = match ($error) {
        'unknown' => $copy['unknown'],
        'wrong' => $copy['wrong'],
        'expired' => $copy['expired'],
        'error' => $copy['error'],
        default => '',
    };
    if ($id !== '' && find_pending($id)) {
        $form = '<form class="book-form" method="post"><input type="hidden" name="step" value="code"><input type="hidden" name="id" value="' . h($id) . '"><input type="hidden" name="next" value="' . h($next) . '">';
        $form .= '<label>' . h($copy['code']) . '<input name="phoneCode" inputmode="numeric" autocomplete="one-time-code" required></label>';
        if ($note !== '') {
            $form .= '<p class="form-error" role="alert">' . h($note) . '</p>';
        }
        $form .= '<button class="btn btn-ink" type="submit">' . h($copy['confirm']) . '</button></form>';
    } else {
        $form = '<form class="book-form" method="post"><input type="hidden" name="step" value="start"><input type="hidden" name="next" value="' . h($next) . '">';
        $form .= '<label>' . h($copy['identifier']) . '<input name="contact" autocomplete="username" required></label>';
        if ($note !== '') {
            $form .= '<p class="form-error" role="alert">' . h($note) . '</p>';
        }
        $form .= '<button class="btn btn-ink" type="submit">' . h($copy['send']) . '</button></form>';
    }
    render_account_page($lang, '/sign-in', $copy['signTitle'], $copy['signLead'], $form);
}

function handle_sign_in(string $lang): never
{
    $step = text_field($_POST['step'] ?? '', 20);
    $next = safe_next($lang, text_field($_POST['next'] ?? '', 80));
    if ($step === 'code') {
        $id = text_field($_POST['id'] ?? '', 80);
        $code = text_field($_POST['phoneCode'] ?? '', 12);
        $pending = find_pending($id);
        if (!$pending || (int) ($pending['attempts'] ?? 0) >= 8 || strtotime((string) ($pending['expiresAt'] ?? '')) <= time()) {
            account_error($lang, 'sign-in', 'expired', $next);
        }
        $ok = hash_equals(code_hash($id, 'phone', $code), (string) ($pending['phoneCodeHash'] ?? ''));
        if (!$ok) {
            $pending['attempts'] = (int) ($pending['attempts'] ?? 0) + 1;
            update_pending($pending);
            redirect('/' . $lang . '/sign-in?id=' . rawurlencode($id) . '&next=' . rawurlencode($next) . '&error=wrong');
        }
        $pending['phoneVerified'] = true;
        unset($pending['emailCode'], $pending['phoneCode']);
        update_pending($pending);
        $accountId = (string) ($pending['accountId'] ?? '');
        if ($accountId === '') {
            account_error($lang, 'sign-in', 'unknown', $next);
        }
        set_client_cookie($accountId);
        redirect($next);
    }
    $contact = text_field($_POST['contact'] ?? '', 160);
    $account = find_client_by_contact($contact);
    if (!$account) {
        account_error($lang, 'sign-in', 'unknown', $next);
    }
    $id = bin2hex(random_bytes(16));
    $emailCode = new_otp();
    $phoneCode = new_otp();
    save_pending([
        'id' => $id,
        'name' => $account['name'],
        'email' => $account['email'],
        'phone' => $account['phone'],
        'accountId' => $account['id'],
        'emailCodeHash' => code_hash($id, 'email', $emailCode),
        'phoneCodeHash' => code_hash($id, 'phone', $phoneCode),
        'emailCode' => $emailCode,
        'phoneCode' => $phoneCode,
        'emailVerified' => true,
        'phoneVerified' => false,
        'attempts' => 0,
        'expiresAt' => gmdate('c', time() + 600),
        'createdAt' => gmdate('c'),
    ]);
    redirect('/' . $lang . '/sign-in?id=' . rawurlencode($id) . '&next=' . rawurlencode($next));
}

function render_register(string $lang): void
{
    $copy = account_copy($lang);
    $client = client_account();
    if ($client) {
        render_account_page($lang, '/register', $copy['regTitle'], $copy['regLead'], '<p>' . h(str_replace('{name}', (string) $client['name'], messages($lang)['nav']['account'] ?? $client['name'])) . '</p>');
        return;
    }
    $error = text_field($_GET['error'] ?? '', 40);
    $next = safe_next($lang, text_field($_GET['next'] ?? '', 80));
    $id = text_field($_GET['id'] ?? '', 80);
    $note = match ($error) {
        'mismatch' => $copy['mismatch'],
        'wrong' => $copy['regWrong'],
        'expired' => $copy['expired'],
        default => $error !== '' ? $copy['regError'] : '',
    };
    if ($id !== '' && find_pending($id)) {
        $form = '<form class="book-form" method="post"><input type="hidden" name="step" value="code"><input type="hidden" name="id" value="' . h($id) . '"><input type="hidden" name="next" value="' . h($next) . '"><p>' . h($copy['codesLead']) . '</p>';
        $form .= '<label>' . h($copy['emailCode']) . '<input name="emailCode" inputmode="numeric" required></label>';
        $form .= '<label>' . h($copy['phoneCode']) . '<input name="phoneCode" inputmode="numeric" required></label>';
    } else {
        $form = '<form class="book-form" method="post"><input type="hidden" name="step" value="start"><input type="hidden" name="next" value="' . h($next) . '">';
        $form .= '<label>' . h($copy['name']) . '<input name="name" autocomplete="name" required></label>';
        $form .= '<label>' . h($copy['email']) . '<input name="email" type="email" autocomplete="email" required></label>';
        $form .= '<label>' . h($copy['phone']) . '<input name="phone" type="tel" autocomplete="tel" required></label>';
    }
    if ($note !== '') {
        $form .= '<p class="form-error" role="alert">' . h($note) . '</p>';
    }
    $form .= '<button class="btn btn-ink" type="submit">' . h($id !== '' ? $copy['regConfirm'] : $copy['send']) . '</button></form>';
    render_account_page($lang, '/register', $copy['regTitle'], $copy['regLead'], $form);
}

function handle_register(string $lang): never
{
    $step = text_field($_POST['step'] ?? '', 20);
    $next = safe_next($lang, text_field($_POST['next'] ?? '/' . $lang . '/book', 80));
    if ($next === '/' . $lang) {
        $next = '/' . $lang . '/book';
    }
    if ($step === 'code') {
        $id = text_field($_POST['id'] ?? '', 80);
        $pending = find_pending($id);
        if (!$pending || strtotime((string) ($pending['expiresAt'] ?? '')) <= time()) {
            account_error($lang, 'register', 'expired', $next);
        }
        $emailCode = text_field($_POST['emailCode'] ?? '', 12);
        $phoneCode = text_field($_POST['phoneCode'] ?? '', 12);
        $emailOk = hash_equals(code_hash($id, 'email', $emailCode), (string) ($pending['emailCodeHash'] ?? ''));
        $phoneOk = hash_equals(code_hash($id, 'phone', $phoneCode), (string) ($pending['phoneCodeHash'] ?? ''));
        if (!$emailOk || !$phoneOk) {
            $pending['attempts'] = (int) ($pending['attempts'] ?? 0) + 1;
            update_pending($pending);
            redirect('/' . $lang . '/register?id=' . rawurlencode($id) . '&next=' . rawurlencode($next) . '&error=wrong');
        }
        $store = store_load();
        $account = null;
        foreach ($store['clients'] ?? [] as $index => $client) {
            if (($client['id'] ?? '') === ($pending['accountId'] ?? '') || strtolower((string) ($client['email'] ?? '')) === strtolower((string) $pending['email'])) {
                $client['name'] = $pending['name'];
                $client['phone'] = $pending['phone'];
                $client['emailVerified'] = true;
                $client['phoneVerified'] = true;
                $store['clients'][$index] = $client;
                $account = $client;
                break;
            }
        }
        if (!$account) {
            $account = [
                'id' => bin2hex(random_bytes(16)),
                'name' => $pending['name'],
                'email' => $pending['email'],
                'phone' => $pending['phone'],
                'emailVerified' => true,
                'phoneVerified' => true,
                'createdAt' => gmdate('c'),
            ];
            $store['clients'][] = $account;
        }
        unset($pending['emailCode'], $pending['phoneCode']);
        $pending['emailVerified'] = true;
        $pending['phoneVerified'] = true;
        $pending['accountId'] = $account['id'];
        foreach ($store['registrations'] as $index => $item) {
            if (($item['id'] ?? '') === $pending['id']) {
                $store['registrations'][$index] = $pending;
            }
        }
        store_save($store);
        set_client_cookie((string) $account['id']);
        redirect($next);
    }
    $name = text_field($_POST['name'] ?? '', 120);
    $email = strtolower(text_field($_POST['email'] ?? '', 160));
    $phone = text_field($_POST['phone'] ?? '', 40);
    if (mb_strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen(digits_only($phone)) < 6) {
        account_error($lang, 'register', 'error', $next);
    }
    foreach (store_load()['clients'] ?? [] as $client) {
        if (strtolower((string) ($client['email'] ?? '')) === $email && digits_only((string) ($client['phone'] ?? '')) !== digits_only($phone)) {
            account_error($lang, 'register', 'mismatch', $next);
        }
    }
    $id = bin2hex(random_bytes(16));
    $emailCode = new_otp();
    $phoneCode = new_otp();
    save_pending([
        'id' => $id,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'emailCodeHash' => code_hash($id, 'email', $emailCode),
        'phoneCodeHash' => code_hash($id, 'phone', $phoneCode),
        'emailCode' => $emailCode,
        'phoneCode' => $phoneCode,
        'emailVerified' => false,
        'phoneVerified' => false,
        'attempts' => 0,
        'expiresAt' => gmdate('c', time() + 600),
        'createdAt' => gmdate('c'),
    ]);
    redirect('/' . $lang . '/register?id=' . rawurlencode($id) . '&next=' . rawurlencode($next));
}
