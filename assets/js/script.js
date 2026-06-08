// Creator: Mohanish Janjan.
// CANVAS BACKGROUND ANIMATION
const canvas = document.getElementById("network-canvas");
const ctx = canvas.getContext("2d");
const homeSection = document.getElementById("home");

let particles = [];
const particleCount = 90;
const maxDistance = 110;
const connectionDistance = maxDistance * maxDistance;

let mouse = {
    x: null,
    y: null,
    radius: 150,
};

// Track mouse movement inside the home section
homeSection.addEventListener("mousemove", (event) => {
    let rect = homeSection.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

homeSection.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

// Resize canvas dynamically
function resizeCanvas() {
    canvas.width = homeSection.offsetWidth;
    canvas.height = homeSection.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = "rgba(0, 255, 255, 0.7)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}
init();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // BACKGROUND CONSTELLATION
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distanceSquared = dx * dx + dy * dy;

            if (distanceSquared < connectionDistance) {
                let opacity = 1 - distanceSquared / connectionDistance;
                ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.4})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        // ACTIVE PATTERNS WITH MOUSE
        if (mouse.x !== null && mouse.y !== null) {
            let dxMouse = particles[i].x - mouse.x;
            let dyMouse = particles[i].y - mouse.y;
            let distanceMouseSquared = dxMouse * dxMouse + dyMouse * dyMouse;
            let mouseConnectionDistance = mouse.radius * mouse.radius;

            if (distanceMouseSquared < mouseConnectionDistance) {
                let opacity = 1 - distanceMouseSquared / mouseConnectionDistance;
                ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.8})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}
animate();

// NAVBAR ACTIVE ANIMATION
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".navlinks li a");

const scrollOptions = {
    root: null,
    rootMargin: "-40% 0px -50% 0px",
    threshold: 0,
};

// CREATE OBSERVER
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");

            navItems.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${id}`) {
                    link.classList.add("active");
                }
            });
        }
    });
}, scrollOptions);

// EXECUTE OBSERVER
sections.forEach((section) => {
    scrollObserver.observe(section);
});

// MOBILE SIDE MENU TOGGLE
const menuBtn = document.getElementById("menu-icons");
const navLinks = document.querySelector(".navlinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active-menu");
});

navLinks.addEventListener("click", () => {
    navLinks.classList.remove("active-menu");
});