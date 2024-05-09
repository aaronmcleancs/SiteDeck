window.addEventListener('DOMContentLoaded', (event) => {
    function ensureProperUrl(inputUrl) {
        inputUrl = inputUrl.trim();
        if (!inputUrl.match(/^https?:\/\//i)) {
            inputUrl = 'https://' + inputUrl;
        }
        if (!inputUrl.match(/^https?:\/\/www\./i)) {
            inputUrl = inputUrl.replace(/^https?:\/\//i, 'https://www.');
        }
        return inputUrl;
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    const siteUrl = ensureProperUrl(getParameterByName('url'));

    let secondaryBgColor = getComputedStyle(document.documentElement)
                            .getPropertyValue('--secondary-bg-color').trim();

    class Circle {
        constructor(x, y, radius, color, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.speedX = speedX;
            this.speedY = speedY;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }

        move(canvasWidth, canvasHeight) {
            if (this.x + this.radius >= canvasWidth || this.x - this.radius <= 0) {
                this.speedX = -this.speedX;
            }

            if (this.y + this.radius >= canvasHeight || this.y - this.radius <= 0) {
                this.speedY = -this.speedY;
            }

            this.x += this.speedX;
            this.y += this.speedY;
        }
    }

    if (siteUrl) {
        fetch(`/fetchContent?url=${encodeURIComponent(siteUrl)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                const container = document.querySelector('.large-rectangle');
                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.srcdoc = html;
                container.appendChild(iframe);

                // Assume the function extractColors extracts colors from the HTML
                const colors = [secondaryBgColor, ...extractColors(html).map(color => `${color}15`)];

                let canvas = document.createElement('canvas');
                document.body.appendChild(canvas);
                canvas.style.position = 'fixed';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.zIndex = '-1';
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                let ctx = canvas.getContext('2d');
                const circles = [];
                colors.forEach((color) => {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const radius = Math.random() * 50 + 40;
                    const speedX = Math.random() * 2 - 1;
                    const speedY = Math.random() * 2 - 1;
                    circles.push(new Circle(x, y, radius, color, speedX, speedY));
                });

                function animate() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    circles.forEach(circle => {
                        circle.move(canvas.width, canvas.height);
                        circle.draw(ctx);
                    });
                    requestAnimationFrame(animate);
                }

                animate();
            })
            .catch(error => {
                console.error("There was a problem with the fetch operation:", error.message);
            });
    }

    const rootStyle = getComputedStyle(document.documentElement);
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                secondaryBgColor = rootStyle.getPropertyValue('--secondary-bg-color').trim();
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
});
