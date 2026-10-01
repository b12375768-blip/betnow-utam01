(function () {
  'use strict';

  var CONTACT_EMAIL = 'contact@snookerandbilliard.com';

  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-nav-menu]');

  if (toggle && menu) {
    var closeMenu = function () {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', function () {
      var open = menu.classList.contains('is-open');
      menu.classList.toggle('is-open', !open);
      toggle.setAttribute('aria-expanded', String(!open));
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var target = link.getAttribute('href');
      if (!target || target.length < 2) return;
      var element = document.querySelector(target);
      if (!element) return;
      event.preventDefault();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.focus({ preventScroll: true });
      try {
        window.history.replaceState(null, '', target);
      } catch (error) {
        void error;
      }
    });
  });

  function mailtoLink(subject, body) {
    return 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
    var status = document.getElementById(form.getAttribute('data-status') || '');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!form.reportValidity()) {
        if (status) {
          status.className = 'form-status is-error';
          status.innerHTML = 'Please check the highlighted fields and try again. You can also write to us directly at <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.';
          status.hidden = false;
        }
        return;
      }

      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().trim();
      var topic = (data.get('topic') || 'General enquiry').toString().trim();
      var timing = (data.get('timing') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();

      var lines = [
        'Name: ' + name,
        'Email: ' + email
      ];
      if (phone) lines.push('Phone: ' + phone);
      if (timing) lines.push('Preferred day/time: ' + timing);
      lines.push('Enquiry type: ' + topic);
      lines.push('');
      lines.push(message);

      var body = lines.join('\n');
      var subject = 'Website enquiry - ' + topic + ' - ' + name;

      if (status) {
        status.className = 'form-status is-info';
        status.innerHTML = 'Your email app should now open with the message ready to send. Nothing is stored on this website. ' +
          'If no window opened, use the link below or email <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> directly.' +
          '<br><a class="btn small" href="' + mailtoLink(subject, body) + '">Open the pre-filled email</a>';
        status.hidden = false;
      }

      window.location.href = mailtoLink(subject, body);
    });
  });

  var popup = document.getElementById('book-popup');
  var POPUP_KEY = 'sb_popup_dismissed';
  var POPUP_REOPEN_DAYS = 7;

  function openPopup() {
    if (!popup) return;
    popup.hidden = false;
    document.body.classList.add('modal-open');
    var closeButton = popup.querySelector('[data-modal-close]');
    if (closeButton) closeButton.focus();
  }

  function closePopup() {
    if (!popup) return;
    popup.hidden = true;
    document.body.classList.remove('modal-open');
    try {
      window.localStorage.setItem(POPUP_KEY, String(Date.now()));
    } catch (error) {
      void error;
    }
  }

  if (popup) {
    var lastDismissed = 0;
    try {
      lastDismissed = parseInt(window.localStorage.getItem(POPUP_KEY) || '0', 10) || 0;
    } catch (error) {
      void error;
    }

    var daysSinceDismissed = (Date.now() - lastDismissed) / 86400000;

    if (daysSinceDismissed >= POPUP_REOPEN_DAYS) {
      window.setTimeout(openPopup, 900);
    }

    document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        openPopup();
      });
    });

    popup.addEventListener('click', function (event) {
      if (event.target === popup || event.target.closest('[data-modal-close]')) {
        closePopup();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !popup.hidden) closePopup();
    });
  }

  document.querySelectorAll('[data-year]').forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });
})();