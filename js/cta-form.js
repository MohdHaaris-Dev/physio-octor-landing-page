/**
 * CTA form — validation + submission to the Octor API.
 *
 * NOTE: styles for .cta-input.error / .success, .form-status, .btn-success
 * etc. now live in css/07-cta.css — this file no longer injects them.
 */
(function () {
  'use strict';

  const API_CONFIG = {
    url: 'https://api.request-management.octor.health/api/v1/submissions',
    headers: {
      'X-API-TOKEN': '9f3c7a1d6e4b8c2f0a5d9e7b3c1f6a8e2d4b7c9f1a3e5d8b0c6f2a9e4d7b1c5',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const VALIDATORS = {
    name: (value) => {
      const v = (value || '').trim();
      if (!v) return { valid: false, message: 'Name is required' };
      if (v.length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
      if (!/^[A-Za-z\s.-]+$/.test(v)) {
        return { valid: false, message: 'Name should only contain letters, spaces, dots, or hyphens' };
      }
      return { valid: true };
    },
    phone: (value) => {
      const digits = (value || '').replace(/\D/g, '');
      if (!digits) return { valid: false, message: 'Phone number is required' };
      if (digits.length !== 10) return { valid: false, message: 'Phone number must be exactly 10 digits' };
      return { valid: true };
    }
  };

  let fields, submitBtn, statusDiv;

  function getOrCreateErrorEl(fieldName, fieldEl) {
    let el = document.getElementById(`${fieldName}Error`);
    if (!el && fieldEl) {
      el = document.createElement('div');
      el.id = `${fieldName}Error`;
      el.className = 'cta-error-message';
      fieldEl.parentNode.appendChild(el);
    }
    return el;
  }

  function validateField(fieldName) {
    const fieldEl = fields[fieldName];
    if (!fieldEl) return { valid: true };

    const result = VALIDATORS[fieldName](fieldEl.value);
    const errorEl = getOrCreateErrorEl(fieldName, fieldEl);

    fieldEl.classList.toggle('error', !result.valid);
    fieldEl.classList.toggle('success', result.valid && fieldEl.value.trim().length > 0);

    if (errorEl) {
      errorEl.textContent = result.valid ? '' : result.message;
      errorEl.classList.toggle('show', !result.valid);
    }
    return result;
  }

  function validateForm() {
    const results = Object.keys(VALIDATORS).map(validateField);
    const isValid = results.every((r) => r.valid);

    if (!isValid) {
      const firstError = document.querySelector('.cta-input.error');
      firstError?.focus();
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return isValid;
  }

  function buildPayload() {
    const name = fields.name?.value.trim() || '';
    const phone = fields.phone?.value.trim() || '';
    const source = new URLSearchParams(location.search).get('source') || document.referrer || 'direct';

    return {
      website_id: 'physio-landing',
      form: { id: 'contact-form', name: 'Contact Form', version: '1.0' },
      contact: {
        name: name || 'Unknown',
        email: 'unknown@example.com',
        phone: phone ? `+91${phone}` : 'Not provided'
      },
      message: {
        subject: `Demo Request from ${name || 'Visitor'}`,
        text: 'Demo request from CTA section'
      },
      tracking: { source },
      page: { url: location.href },
      metadata: {}
    };
  }

  async function sendFormData(payload) {
    try {
      const res = await fetch(API_CONFIG.url, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `HTTP ${res.status}`);
      }
      return { success: true, data: await res.json() };
    } catch (err) {
      console.error('API Error:', err);
      return { success: false, error: err.message };
    }
  }

  function showStatus(message, type = 'info') {
    if (!statusDiv) return;
    statusDiv.textContent = message;
    statusDiv.className = `form-status ${type}`;
    statusDiv.style.display = 'block';
    if (type !== 'error') {
      setTimeout(() => (statusDiv.style.display = 'none'), 5000);
    }
  }

  function setButtonLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Submitting...' : 'Book a demo';
  }

  function resetForm() {
    ['name', 'phone'].forEach((name) => {
      const el = fields[name];
      if (!el) return;
      el.value = '';
      el.classList.remove('success', 'error');
      document.getElementById(`${name}Error`)?.classList.remove('show');
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
      showStatus('Please fix the errors highlighted above.', 'error');
      return;
    }

    showStatus('Submitting your request...', 'info');
    setButtonLoading(true);

    const result = await sendFormData(buildPayload());

    if (result.success) {
      showStatus("Thanks — we'll be in touch within one working day.", 'success');
      submitBtn.textContent = 'Submitted!';
      submitBtn.classList.add('btn-success');
      submitBtn.disabled = true;
      resetForm();

      setTimeout(() => {
        submitBtn.textContent = 'Book a demo';
        submitBtn.classList.remove('btn-success');
        submitBtn.disabled = false;
      }, 3000);
    } else {
      showStatus(`Error: ${result.error || 'Something went wrong. Please try again.'}`, 'error');
      setButtonLoading(false);
    }
  }

  function ensureStatusDiv() {
    let el = document.getElementById('formStatus');
    if (!el) {
      el = document.createElement('div');
      el.id = 'formStatus';
      el.className = 'form-status';
      const form = document.querySelector('.cta-form');
      form?.parentNode.insertBefore(el, form);
    }
    return el;
  }

  function init() {
    fields = {
      name: document.getElementById('name'),
      phone: document.getElementById('phone')
    };
    submitBtn = document.querySelector('.cta-form .btn-primary');
    statusDiv = ensureStatusDiv();

    fields.name?.addEventListener('input', () => fields.name.value && validateField('name'));
    fields.name?.addEventListener('blur', () => validateField('name'));

    fields.phone?.addEventListener('input', () => {
      fields.phone.value = fields.phone.value.replace(/\D/g, '').slice(0, 10);
      validateField('phone');
    });
    fields.phone?.addEventListener('blur', () => validateField('phone'));

    submitBtn?.addEventListener('click', handleSubmit);

    document.querySelector('.cta-form')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSubmit(e);
    });
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
