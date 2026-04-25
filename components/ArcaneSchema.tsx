import React from 'react';

const ArcaneSchema = () => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": "https://euler.life/#service",
        "name": "Euler's Market: The Grand Bazaar of AI Tokens",
        "serviceType": "Subscription Portability & Resale",
        "provider": {
            "@type": "Organization",
            "@id": "https://euler.life/#organization",
            "name": "Euler Growth & Creative",
            "url": "https://euler.life",
            "logo": "https://euler.life/logo-gold.png" // Ensure this exists in your QuestUI theme
        },
        "description": "A secure, peer-to-peer guild for the ethical exchange of Claude Max seats and other high-tier AI artifacts. Breaking the chains of the annual subscription trap through mathematical precision.",
        "offers": {
            "@type": "Offer",
            "description": "Subscription Resale with a $1 Arcane Safety Cap",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
    );
};

export default ArcaneSchema;