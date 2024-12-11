console.log("Listener script started.");

async function askGPT(prompt) {
    try {
        const response = await fetch('http://localhost:3000/testGPT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: prompt })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to send data to GPT-4:", error);
        return null;
    }
}

function setCardIcon(card, score = 10) {
    const iconElement = card.querySelector('.icon');
    if (score >= 8) {
        iconElement.src = "icon/good.png";
    } else if (score >= 4) {
        iconElement.src = "icon/warning.png";
    } else {
        iconElement.src = "icon/critical.png";
    }
}

let checkIframeInterval = setInterval(async () => {
    const iframe = document.querySelector('iframe[srcdoc]');  
    if (!iframe) {
        document.querySelector('.loading').style.display = 'block';
        document.querySelector('.iframe-wrapper').setAttribute('data-loading', 'false');
        return;
    }

    const iframeDocument = iframe.contentDocument;
    const iframeContent = iframeDocument.body.innerText;
    const websiteTitle = iframeDocument.title;

    clearInterval(checkIframeInterval);

    document.querySelector('.doublecard-title').innerText = websiteTitle;
    document.querySelector('.doublecard-title').removeAttribute('data-loading');
    
    const websiteTypeAndDescriptionPrompt = `Based on the provided content, describe the type of store or service this website offers in a short sentence. Content: "${iframeContent}"`;

    const websiteDescriptionResponse = await askGPT(websiteTypeAndDescriptionPrompt);
    if (websiteDescriptionResponse && websiteDescriptionResponse[0] && websiteDescriptionResponse[0].message) {
        document.querySelector('.card-description').innerText = websiteDescriptionResponse[0].message.content;
        document.querySelector('.double-rectangle').removeAttribute('data-loading');
    }

    const categoriesPrompts = {
        "Legibility": `Analyze the legibility of the website's content and provide a brief feedback.`,
        "SEO": `Provide a concise feedback on the SEO potential of this website content.`,
        "Call To Action": `Review the website's content for call-to-action elements and give a short feedback.`,
        "Branding": `Provide feedback on the branding elements present in the website content.`
    };

    const categories = ["Legibility", "SEO", "Call To Action", "Branding"];
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const prompt = `${categoriesPrompts[category]} Content: "${iframeContent}"`;
        const gptResponse = await askGPT(prompt);

        if (gptResponse && gptResponse[0] && gptResponse[0].message) {
            const card = document.querySelector(`.right-section .medium-rectangle:nth-child(${i + 1})`);
            if (card) {
                const descElement = card.querySelector('.card-description');
                descElement.innerText = gptResponse[0].message.content;
                setCardIcon(card);
                descElement.removeAttribute('data-loading');  // Remove loading placeholder from description
            }
        }
    }
    document.querySelector('.iframe-wrapper').setAttribute('data-loading', 'false');
}, 500);
