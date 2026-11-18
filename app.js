'use strict';
(() => {
  const form = document.getElementById('rsvp-form');
  const name = document.getElementById('responsible');
  const phone = document.getElementById('phone');
  const students = document.getElementById('students');
  const relatives = document.getElementById('relatives');
  const fields = [students, relatives];
  function updateCount() {
    const valid = fields.every(input => input.validity.valid && Number.isInteger(input.valueAsNumber));
    const total = valid ? students.valueAsNumber + relatives.valueAsNumber : null;
    document.getElementById('total').textContent = total === null ? 'Confira os números' : `${total} ${total === 1 ? 'pessoa' : 'pessoas'}`;
    document.querySelectorAll('[data-step]').forEach(button => {
      const input = document.getElementById(button.dataset.for);
      button.disabled = Number(button.dataset.step) < 0 ? input.valueAsNumber <= Number(input.min) : input.valueAsNumber >= Number(input.max);
    });
    return valid;
  }
  document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.for);
    const min = Number(input.min), max = Number(input.max);
    input.value = String(Math.min(max, Math.max(min, (Number.isFinite(input.valueAsNumber) ? Math.floor(input.valueAsNumber) : min) + Number(button.dataset.step))));
    updateCount();
  }));
  fields.forEach(input => input.addEventListener('input', updateCount));
  phone.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g, '').slice(0,11);
    if (!digits) { phone.value = ''; return; }
    const local = digits.slice(2);
    phone.value = '(' + digits.slice(0,2) + (digits.length > 2 ? ') ' : '') + (local.length > 8 ? local.slice(0,5) + '-' + local.slice(5) : local.length > 4 ? local.slice(0,4) + '-' + local.slice(4) : local);
  });
  function error(input, id, message) {
    const target = document.getElementById(id);
    target.textContent = message;
    target.hidden = !message;
    input.setAttribute('aria-invalid', String(Boolean(message)));
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const validName = name.value.trim().length >= 2;
    const validPhone = /^\d{10,11}$/.test(phone.value.replace(/\D/g, ''));
    const validCount = updateCount();
    error(name, 'responsible-error', validName ? '' : 'Informe o nome do responsável.');
    error(phone, 'phone-error', validPhone ? '' : 'Informe um WhatsApp com DDD, com 10 ou 11 números.');
    const countError = document.getElementById('count-error');
    countError.hidden = validCount;
    countError.textContent = validCount ? '' : 'Use números inteiros: de 0 a 99 alunos e de 1 a 99 familiares, incluindo você.';
    fields.forEach(input => input.setAttribute('aria-invalid', String(!input.validity.valid || !Number.isInteger(input.valueAsNumber))));
    if (!validName || !validPhone || !validCount) {
      (!validName ? name : !validPhone ? phone : fields.find(input => !input.validity.valid || !Number.isInteger(input.valueAsNumber))).focus();
      return;
    }
    // Preview only: no network request, database write, or browser storage.
    document.getElementById('success-name').textContent = name.value.trim();
    document.getElementById('success-students').textContent = students.value;
    document.getElementById('success-relatives').textContent = relatives.value;
    document.getElementById('success-total').textContent = String(students.valueAsNumber + relatives.valueAsNumber);
    document.getElementById('form-view').hidden = true;
    document.getElementById('success-view').hidden = false;
    document.getElementById('success-title').focus({preventScroll:true});
    document.getElementById('confirmar').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'start'});
  });
  document.getElementById('edit-response').addEventListener('click', () => {
    document.getElementById('success-view').hidden = true;
    document.getElementById('form-view').hidden = false;
    name.focus({preventScroll:true});
  });
  updateCount();
})();
