(function () {
  'use strict';
  var form = document.getElementById('sy-inquiry-form-el');
  if (!form) return;
  var cfg = window.SPARYN_CONTACT || {};
  var alertEl = document.getElementById('sy-form-alert');
  var freeDomains = Array.isArray(cfg.free_email_domains) ? cfg.free_email_domains : [];

  function showAlert(msg) {
    if (!alertEl) return;
    alertEl.hidden = false;
    alertEl.textContent = msg;
  }

  function isBusinessEmail(email) {
    var at = email.lastIndexOf('@');
    if (at < 1) return false;
    var domain = email.slice(at + 1).toLowerCase().trim();
    return domain && domain.indexOf('.') !== -1 && freeDomains.indexOf(domain) === -1;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (alertEl) { alertEl.hidden = true; alertEl.textContent = ''; }
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var email = document.getElementById('sy-email');
    if (!isBusinessEmail(email.value)) {
      showAlert(cfg.email_blocked_text || 'Please use a business email domain.');
      email.focus();
      return;
    }

    var lines = [
      'Sparyn Trim Inquiry',
      '',
      'Name: ' + document.getElementById('sy-name').value.trim(),
      'Company: ' + document.getElementById('sy-company').value.trim(),
      'Email: ' + email.value.trim(),
      'Website: ' + (document.getElementById('sy-website').value.trim() || 'N/A'),
      'Product: ' + document.getElementById('sy-service').value,
      'Quantity: ' + document.getElementById('sy-volume').value,
      'Markets: ' + document.getElementById('sy-markets').value,
      'Details: ' + document.getElementById('sy-brief').value.trim(),
      'Attachment: ' + ((document.getElementById('sy-file').files[0] && document.getElementById('sy-file').files[0].name) || 'None'),
    ];

    var subject = encodeURIComponent(cfg.subject || 'Sparyn Trim Inquiry');
    var body = encodeURIComponent(lines.join('\n'));
    var to = cfg.email_to || 'sales@sparyn.com';
    window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
    showAlert(cfg.success_text || 'Your email app should open with a pre-filled inquiry.');
  });
})();
