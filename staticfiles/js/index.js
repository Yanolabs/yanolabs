
// HEADER SECTION

window.onscroll = function() {stickHeader()};

var header = document.getElementById("yanoHeader")
var sticky = header.offsetTop;

function stickHeader() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

// MENU ICON SECTION

document.addEventListener("DOMContentLoaded", function () {
	const menuIcon = document.getElementById("menuIcon");
	const navLinks = document.getElementById("navLinks");

	function toggleMenu(event) {
		event.stopPropagation(); 
		console.log("Menu clicked!");
		navLinks.classList.toggle("active");
	}

	menuIcon.addEventListener("click", toggleMenu);

	window.addEventListener("scroll", function () {
		navLinks.classList.remove("active");
	});

	document.addEventListener("click", function (event) {
		if (!navLinks.contains(event.target) && event.target !== menuIcon) {
			navLinks.classList.remove("active");
		}
	});
});

// SERVICE FORM SECTION

function toggleForm() {
  const form = document.getElementById("myForm");
  form.classList.toggle("active");

  if (form.classList.contains("active")) {
    document.addEventListener("click", outsideClickListener);
    window.addEventListener("scroll", hideFormOnScroll);
  }
  else {
    removeFormListeners();
  }
}

function outsideClickListener(e) {
  const form = document.getElementById("myForm");
  const button = document.getElementById("homeBtn");

  if (!form.contains(e.target) && !button.contains(e.target)) {
    form.classList.remove("active");
    removeFormListeners();
  }
}

function hideFormOnScroll() {
  const form = document.getElementById("myForm");
  form.classList.remove("active");
  removeFormListeners();
}

function removeFormListeners() {
  document.removeEventListener("click", outsideClickListener);
  window.removeEventListener("scroll", hideFormOnScroll);
}

// MORE CONTENT
	const plainText = "Finding High-quality, Trustworthy Developers and Designers online can be difficult.";
  const formattedHTML = 'Finding High-quality, Trustworthy <span class="devs">Developers</span> and <span class="designers">designers</span> online can be difficult.';
  
  const speed = 35;
  let index = 0;
  let typingTimeout;

  function typeText() {
    const el = document.getElementById("yano-text1");

    if (index < plainText.length) {
      el.textContent += plainText.charAt(index);
      index++;
      typingTimeout = setTimeout(typeText, speed);
    } else {
      el.innerHTML = formattedHTML;
    }
  }

  function startTyping() {
    clearTimeout(typingTimeout);
    index = 0;
    const el = document.getElementById("yano-text1");
    el.textContent = "";
    typeText();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTyping();
      }
    });
  }, {
    threshold: 0.5
  });

  observer.observe(document.getElementById("trigger-section"));

  // UIs SECTION

const webUis = document.querySelectorAll('.webui');
let current = webUis.length - 1;

setInterval(() => {
  webUis[current].style.zIndex = 0;
  webUis[current].style.opacity = 0.6;
  webUis[current].style.transform = `rotate(${Math.random() * 10 - 5}deg) scale(0.95)`;

  current = (current - 1 + webUis.length) % webUis.length;

  webUis[current].style.zIndex = webUis.length;
  webUis[current].style.opacity = 1;
  webUis[current].style.transform = 'rotate(0deg) scale(1.05)';
}, 3000);



const appUis = document.querySelectorAll('.appui');
let uiCurrent = appUis.length - 1;

setInterval(() => {
  appUis[uiCurrent].style.zIndex = 0;
  appUis[uiCurrent].style.opacity = 0.6;
  appUis[uiCurrent].style.transform = `rotate(${Math.random() * 10 - 5}deg) scale(0.95)`;

  uiCurrent = (uiCurrent - 1 + appUis.length) % appUis.length;

  appUis[uiCurrent].style.zIndex = appUis.length;
  appUis[uiCurrent].style.opacity = 1;
  appUis[uiCurrent].style.transform = 'rotate(0deg) scale(1.05)';
}, 3000);



const softUis = document.querySelectorAll('.softui');
let softCurrent = softUis.length - 1;

setInterval(() => {
  softUis[softCurrent].style.zIndex = 0;
  softUis[softCurrent].style.opacity = 0.6;
  softUis[softCurrent].style.transform = `rotate(${Math.random() * 10 - 5}deg) scale(0.95)`;

  softCurrent = (softCurrent - 1 + softUis.length) % softUis.length;

  softUis[softCurrent].style.zIndex = softUis.length;
  softUis[softCurrent].style.opacity = 1;
  softUis[softCurrent].style.transform = 'rotate(0deg) scale(1.05)';
}, 3000);

// TALK TO US FORM SECTION

const textarea = document.getElementById('moreinfo');

  textarea.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });

  // FAQ SECTION

  document.querySelectorAll('.faq-question').forEach((question) => {
  question.addEventListener('click', () => {
    const currentAnswer = question.nextElementSibling;
    const currentIcon = question.querySelector('.icon');

    const isOpen = currentAnswer.classList.contains('open');

    document.querySelectorAll('.faq-answer').forEach((answer) => {
      answer.classList.remove('open');
      answer.previousElementSibling.querySelector('.icon').textContent = '+';
    });

    if (!isOpen) {
      currentAnswer.classList.add('open');
      currentIcon.textContent = '−';
    } else {
      currentAnswer.classList.remove('open');
      currentIcon.textContent = '+';
    }
  });
});
  

  // JOB APPLICATION SECTION

const modal = document.getElementById("cvFormModal");
const openBtn = document.getElementById("openFormBtn");
const closeBtn = document.getElementById("closeFormBtn");

if (openBtn) {
    openBtn.onclick = () => {
        modal.style.display = "block";
        void modal.offsetWidth;
        modal.classList.add("show");
    };
}

if (closeBtn) {
    closeBtn.onclick = () => {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    };
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }
}

const params = new URLSearchParams(window.location.search);

  if (params.get("contact_success") === "true") {
    alert("Submitted successfully. Thank you for Choosing YanoLabs.");
  } 
  else if (params.get("success") === "true") {
    alert("Application sent successfully.");
  } 
  else if (params.get("service_success") === "true") {
    alert("Submitted successfully. Thank you for Choosing YanoLabs.");
  }

  if (params.has("contact_success") || params.has("success") || params.has("service_success")) {
  const url = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, url);
}
