import { shell } from '../components/layout.js';
import { firebaseConfigured } from '../services/firebase.js';
import { friendlyAuthError, loginUser, registerUser, resetPassword } from '../services/auth.js';
import { passwordMessage, validateEmail, validatePhone } from '../utils/validation.js';

function safeRedirect(value) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/account';
}

export function renderLogin(context) {
  if (context.user) { queueMicrotask(() => context.router.navigate(safeRedirect(context.url.searchParams.get('redirect')), true)); return ''; }
  return shell(`<section class="auth-page"><div class="auth-art"><img src="/assets/cars/mercedes-c180.jpg" alt="Premium car detail" onerror="this.src='/assets/cars/placeholder.svg'"><div class="auth-art-copy"><span class="eyebrow" style="color:var(--sun)">Welcome back</span><h1>Your plans, right where you left them.</h1></div></div><div class="auth-panel"><div class="auth-panel-inner"><a class="brand" href="/" data-link><span class="brand-mark">R</span>rentora</a><h1 style="margin-top:35px">Log in</h1><p class="muted">Access your saved booking requests and continue planning.</p><div id="auth-message" aria-live="polite"></div><form class="auth-form" id="login-form" novalidate>
    <div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" required><span class="field-error" id="email-error"></span></div>
    <div class="field password-row"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required><button class="password-toggle" type="button" data-password-toggle="password">Show</button><span class="field-error" id="password-error"></span></div>
    <button class="btn" type="submit">Log in</button></form><div class="auth-links"><button class="filter-reset" id="forgot-password" type="button">Forgot password?</button><span>New here? <a href="/register${context.url.search ? `?${new URLSearchParams({ redirect: context.url.searchParams.get('redirect') || '' })}` : ''}" data-link>Create account</a></span></div></div></div></section>`, { hideHeader: true, hideFooter: true });
}

export function mountLogin({ url, router }) {
  bindPasswordToggle();
  const form = document.querySelector('#login-form');
  const message = document.querySelector('#auth-message');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    document.querySelector('#email-error').textContent = validateEmail(email) ? '' : 'Enter a valid email address.';
    document.querySelector('#password-error').textContent = password ? '' : 'Enter your password.';
    if (!validateEmail(email) || !password) return;
    if (!firebaseConfigured) { message.innerHTML = '<p class="notice notice-error">Firebase is not configured. Add your web app values to .env.local.</p>'; return; }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true; button.textContent = 'Logging in…';
    try {
      await loginUser(email, password);
      router.navigate(safeRedirect(url.searchParams.get('redirect')), true);
    } catch (error) {
      message.innerHTML = `<p class="notice notice-error">${friendlyAuthError(error)}</p>`;
      button.disabled = false; button.textContent = 'Log in';
    }
  });
  document.querySelector('#forgot-password').addEventListener('click', async () => {
    const email = form.email.value.trim();
    if (!validateEmail(email)) { document.querySelector('#email-error').textContent = 'Enter your email above first.'; return; }
    try {
      await resetPassword(email);
      message.innerHTML = '<p class="notice notice-success">Password reset email sent. Check your inbox.</p>';
    } catch (error) { message.innerHTML = `<p class="notice notice-error">${friendlyAuthError(error)}</p>`; }
  });
}

export function renderRegister(context) {
  if (context.user) { queueMicrotask(() => context.router.navigate(safeRedirect(context.url.searchParams.get('redirect')), true)); return ''; }
  return shell(`<section class="auth-page"><div class="auth-art"><img src="/assets/cars/kia-sportage.jpg" alt="Car ready for a journey" onerror="this.src='/assets/cars/placeholder.svg'"><div class="auth-art-copy"><span class="eyebrow" style="color:var(--sun)">Join Rentora</span><h1>One account. Every journey in view.</h1></div></div><div class="auth-panel"><div class="auth-panel-inner"><a class="brand" href="/" data-link><span class="brand-mark">R</span>rentora</a><h1 style="margin-top:30px">Create account</h1><p class="muted">Register to submit and manage your demo booking requests.</p><div id="auth-message" aria-live="polite"></div><form class="auth-form" id="register-form" novalidate>
    <div class="field"><label for="displayName">Full name</label><input id="displayName" name="displayName" autocomplete="name" maxlength="80" required><span class="field-error" id="name-error"></span></div>
    <div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required><span class="field-error" id="email-error"></span></div>
    <div class="field"><label for="phone">Egyptian mobile number</label><input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="010 1234 5678" maxlength="24" required><span class="field-error" id="phone-error"></span></div>
    <div class="field password-row"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="new-password" required><button class="password-toggle" type="button" data-password-toggle="password">Show</button><span class="field-error" id="password-error"></span></div>
    <button class="btn" type="submit">Create my account</button></form><div class="auth-links"><span>Already registered? <a href="/login${context.url.search ? `?${new URLSearchParams({ redirect: context.url.searchParams.get('redirect') || '' })}` : ''}" data-link>Log in</a></span></div></div></div></section>`, { hideHeader: true, hideFooter: true });
}

export function mountRegister({ url, router }) {
  bindPasswordToggle();
  const form = document.querySelector('#register-form');
  const message = document.querySelector('#auth-message');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const errors = {
      name: values.displayName.trim().length >= 2 ? '' : 'Enter your full name.',
      email: validateEmail(values.email) ? '' : 'Enter a valid email address.',
      phone: validatePhone(values.phone) ? '' : 'Enter a valid Egyptian mobile number.',
      password: passwordMessage(values.password)
    };
    Object.entries(errors).forEach(([key, value]) => { document.querySelector(`#${key}-error`).textContent = value; });
    if (Object.values(errors).some(Boolean)) return;
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true; button.textContent = 'Creating account…';
    try {
      await registerUser(values);
      router.navigate(safeRedirect(url.searchParams.get('redirect')), true);
    } catch (error) {
      message.innerHTML = `<p class="notice notice-error">${friendlyAuthError(error)}</p>`;
      button.disabled = false; button.textContent = 'Create my account';
    }
  });
}

function bindPasswordToggle() {
  document.querySelectorAll('[data-password-toggle]').forEach((button) => button.addEventListener('click', () => {
    const input = document.querySelector(`#${button.dataset.passwordToggle}`);
    const reveal = input.type === 'password';
    input.type = reveal ? 'text' : 'password';
    button.textContent = reveal ? 'Hide' : 'Show';
  }));
}
