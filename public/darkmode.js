document.addEventListener("DOMContentLoaded", function() {
    const darkModeButton = document.querySelector("#darkModeToggle");

    if (darkModeButton) {
        console.log("Dark mode button found!");

        darkModeButton.addEventListener("click", function() {
            const currentPrimaryBg = getComputedStyle(document.documentElement).getPropertyValue('--primary-bg-color').trim();
            console.log("Current Primary Background Color:", currentPrimaryBg);

            // If the current primary background color is white, it means it's in light mode
            if (currentPrimaryBg === '#ffffff') {
                console.log("Switching to dark mode...");

                // Switch to dark mode
                document.documentElement.style.setProperty('--primary-bg-color', '#1a1a1a');
                document.documentElement.style.setProperty('--secondary-bg-color', '#040404');
                document.documentElement.style.setProperty('--tertiary-bg-color', '#333333');
                document.documentElement.style.setProperty('--primary-text-color', '#f2f2f2');
                document.documentElement.style.setProperty('--placeholer', '#0f0f0f');
                document.documentElement.style.setProperty('--placeholer2', '#020202');
                document.documentElement.style.setProperty('--secondary-text-color', '#d9d9d9');
            } else {
                console.log("Switching to light mode...");

                // Switch back to light mode
                document.documentElement.style.setProperty('--primary-bg-color', '#ffffff');
                document.documentElement.style.setProperty('--secondary-bg-color', '#f2f2f2');
                document.documentElement.style.setProperty('--tertiary-bg-color', '#d9d9d9');
                document.documentElement.style.setProperty('--primary-text-color', '#1a1a1a');
                document.documentElement.style.setProperty('--placeholder', '#ececec');
                document.documentElement.style.setProperty('--placeholder2', '#e0e0e0');
                document.documentElement.style.setProperty('--secondary-text-color', '#000000');
            }
        });
    } else {
        console.log("Dark mode button not found!");
    }
});
