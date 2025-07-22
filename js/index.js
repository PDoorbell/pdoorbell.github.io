// Scroll to top on page load to prevent auto-animation
window.addEventListener('DOMContentLoaded', () => {
  // Remove window.scrollTo(0, 0); to prevent auto scroll up
});

// Toggle popup
function toggleQuestionBox() {
  const box = document.getElementById("questionBox");
  if (box.style.display === "block") {
    box.style.display = "none";
    document.body.style.overflow = "";
  } else {
    box.style.display = "block";
    document.body.style.overflow = "hidden";
    const input = box.querySelector('input, textarea');
    if (input) input.focus();
  }
}

// Handle question form submission via AJAX
const questionForm = document.querySelector('#questionBox form');
if (questionForm) {
  questionForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(questionForm);
    const submitBtn = questionForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    try {
      const response = await fetch(questionForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        questionForm.reset();
        alert('Your question was sent!');
        toggleQuestionBox();
      } else {
        alert('There was a problem sending your question. Please try again.');
      }
    } catch (err) {
      alert('There was a problem sending your question. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send';
    }
  });
}

// Animate sections on scroll
const sections = document.querySelectorAll("section");
const profileStack = document.querySelector('.profile-stack');
const header = document.getElementById("main-header");
const profileName = document.querySelector('.profile-name');
const profileImg = document.querySelector('.profile-img');
const headerName = document.querySelector('.header-name');
const profileMotto = document.querySelector('.profile-motto');
const headerProfileImg = document.querySelector('.header-profile-img');

let isScrolled = false; // Track state to prevent rapid toggling
let headerNameTimeout = null;

function createAnimatedImg({left, top, width, height, opacity = 1}) {
  const img = document.createElement('img');
  img.src = profileImg.src;
  img.alt = profileImg.alt;
  img.className = 'header-profile-img';
  img.style.position = 'fixed';
  img.style.left = left + 'px';
  img.style.top = top + 'px';
  img.style.width = width + 'px';
  img.style.height = height + 'px';
  img.style.borderRadius = '50%';
  img.style.border = '4px solid var(--accent)';
  img.style.boxShadow = '0 0 10px var(--accent)';
  img.style.objectFit = 'cover';
  img.style.zIndex = 1003;
  img.style.opacity = opacity;
  img.style.background = '#0b0c10';
  img.style.transition = 'all 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s cubic-bezier(0.4,0,0.2,1)';
  return img;
}

function animateProfileImgToHeader() {
  const imgRect = profileImg.getBoundingClientRect();
  const headerRect = header.getBoundingClientRect();
  // Create animated img at profile position
  const animImg = createAnimatedImg({
    left: imgRect.left,
    top: imgRect.top,
    width: imgRect.width,
    height: imgRect.height,
    opacity: 1
  });
  document.body.appendChild(animImg);
  profileImg.style.opacity = '1';
  setTimeout(() => {
    animImg.style.left = (headerRect.left + 18) + 'px';
    animImg.style.top = (headerRect.top + 10) + 'px';
    animImg.style.width = '60px';
    animImg.style.height = '60px';
  }, 10);
  setTimeout(() => {
    header.appendChild(animImg);
    animImg.style.position = 'absolute';
    animImg.style.left = '18px';
    animImg.style.top = '10px';
    animImg.style.width = '60px';
    animImg.style.height = '60px';
    animImg.style.transition = '';
    }, 650);
}

function animateProfileImgToStack() {
  const headerImg = header.querySelector('.header-profile-img');
  if (!headerImg) return;
  const headerRect = headerImg.getBoundingClientRect();
  const imgRect = profileImg.getBoundingClientRect();
  // Move to fixed and animate to stack
  headerImg.style.position = 'fixed';
  headerImg.style.left = headerRect.left + 'px';
  headerImg.style.top = headerRect.top + 'px';
  headerImg.style.width = headerRect.width + 'px';
  headerImg.style.height = headerRect.height + 'px';
  headerImg.style.transition = 'all 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s cubic-bezier(0.4,0,0.2,1)';
  setTimeout(() => {
    headerImg.style.left = imgRect.left + 'px';
    headerImg.style.top = imgRect.top + 'px';
    headerImg.style.width = imgRect.width + 'px';
    headerImg.style.height = imgRect.height + 'px';
    headerImg.style.opacity = '1';
  }, 10);
  setTimeout(() => {
    if (headerImg.parentNode) headerImg.parentNode.removeChild(headerImg);
    profileImg.style.opacity = '1';
  }, 650);
}

window.addEventListener("scroll", () => {
  // Only trigger animation if user has scrolled down at least 10px
  if (window.scrollY < 10) {
    // Reset everything if at the very top
    document.body.classList.remove("scrolled");
    profileStack.classList.remove("sticky");
    headerName.classList.remove('visible');
    profileName.classList.remove('fade');
    profileMotto.classList.remove('fade');
    isScrolled = false;
    if (headerNameTimeout) {
      clearTimeout(headerNameTimeout);
      headerNameTimeout = null;
    }
    return;
  }

  sections.forEach(sec => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 400;
    if (top > offset) {
      sec.classList.add("visible");
    }
  });

  if (!profileStack || !profileImg || !profileName || !headerName || !profileMotto) return;
  const stackRect = profileStack.getBoundingClientRect();
  // Add buffer to prevent rapid toggling (hysteresis)
  if (!isScrolled && stackRect.top <= 60) {
    document.body.classList.add("scrolled");
    profileStack.classList.add("sticky");
    setTimeout(() => {
      profileName.classList.add('fade');
      profileMotto.classList.add('fade');
      animateProfileImgToHeader();
    }, 350);
    headerNameTimeout = setTimeout(() => {
      headerName.classList.add('visible');
    }, 700); // 350ms fade + 350ms buffer
    isScrolled = true;
  } else if (isScrolled && stackRect.top > 120) {
    document.body.classList.remove("scrolled");
    profileStack.classList.remove("sticky");
    headerName.classList.remove('visible');
    profileName.classList.remove('fade');
    profileMotto.classList.remove('fade');
    animateProfileImgToStack();
    isScrolled = false;
    if (headerNameTimeout) {
      clearTimeout(headerNameTimeout);
      headerNameTimeout = null;
    }
  }
});

// Fallback: If JS module fails, allow button to toggle box
const askBtn = document.querySelector('.ask-button');
if (askBtn) {
  askBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var box = document.getElementById('questionBox');
    if (box.style.display === 'block') {
      box.style.display = 'none';
      document.body.style.overflow = '';
    } else {
      box.style.display = 'block';
      document.body.style.overflow = 'hidden';
      var input = box.querySelector('input, textarea');
      if (input) input.focus();
    }
  });
}
// Close popup if click outside
window.addEventListener('click', function(e) {
  var box = document.getElementById('questionBox');
  if (box && box.style.display === 'block' && !box.contains(e.target) && !e.target.classList.contains('ask-button')) {
    box.style.display = 'none';
    document.body.style.overflow = '';
  }
});
