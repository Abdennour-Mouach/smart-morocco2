import React from "react";
import Footer from "./Footer";

const About = () => {
  return (
    <div className="about-page">
      <div className="bg-ornament"></div>
      <div className="bg-pattern"></div>

      <section className="about-section">
        <div className="section-header">
          <span className="section-subtitle">Découvrez l'authenticité</span>
          <h2 className="section-title">
            À PROPOS
            <div className="title-decoration">
              <span className="decoration-line"></span>
              <span className="decoration-dot"></span>
              <span className="decoration-line"></span>
            </div>
          </h2>
        </div>

        <div className="about-content">
          {/* Galerie trois images */}
          <div className="about-gallery">
            <div className="gallery-grid">
              <div className="gallery-item item-1">
                <img
                  src="images/ESSAOUIRA.jpg"
                  alt="Essaouira"
                  className="gallery-img"
                />
                <div className="img-caption">Essaouira</div>
              </div>
              <div className="gallery-item item-2">
                <img
                  src="images/Hassan2.jpg"
                  alt="Mosquée Hassan II"
                  className="gallery-img"
                />
                <div className="img-caption">Casablanca</div>
              </div>
              <div className="gallery-item item-3">
                <img
                  src="images/Atlas.jpg"
                  alt="Haut Atlas"
                  className="gallery-img"
                />
                <div className="img-caption">Haut Atlas</div>
              </div>
            </div>
            <div className="gallery-glow"></div>
          </div>

          <div className="about-text">
            <p>
              La plateforme <span className="highlight">Smart Morocco</span> vous invite à explorer la richesse
              touristique du Maroc à travers une expérience digitale intelligente
              et intuitive. Grâce à des recommandations personnalisées et des
              informations fiables, elle permet aux voyageurs de découvrir
              facilement les plus belles destinations, de planifier leurs
              activités et de profiter pleinement de leur séjour en toute
              simplicité et sécurité.
            </p>

            <div className="signature-line">
              <span className="signature-icon">✦</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .about-page {
          background: linear-gradient(145deg, #fdf9f4 0%, #fff6ed 100%);
          padding: 140px 20px 100px;
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }

        .bg-ornament {
          position: absolute;
          top: 5%;
          right: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(191, 87, 0, 0.06) 0%, rgba(191, 87, 0, 0) 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .bg-pattern {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" opacity="0.03"><path fill="none" stroke="%238b6b42" stroke-width="1" d="M70 30 L30 70 L70 110 L110 70 Z M130 90 L90 130 L130 170 L170 130 Z M40 140 L20 160 L40 180 L60 160 Z M150 40 L130 60 L150 80 L170 60 Z"/><circle cx="100" cy="100" r="8" fill="%238b6b42"/></svg>');
          background-repeat: repeat;
          background-size: 40px;
          pointer-events: none;
          z-index: 0;
        }

        .about-section {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .section-header {
          text-align: center;
          margin-bottom: 70px;
        }

        .section-subtitle {
          display: inline-block;
          color: #b45f2b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 4px;
          font-size: 0.85rem;
          background: rgba(191, 87, 0, 0.08);
          padding: 6px 18px;
          border-radius: 40px;
          backdrop-filter: blur(2px);
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 3.2rem;
          font-weight: 600;
          color: #2c1a12;
          margin: 0;
          letter-spacing: 1px;
          font-family: 'Playfair Display', 'Times New Roman', serif;
        }

        .title-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 16px;
        }

        .decoration-line {
          width: 50px;
          height: 2px;
          background: linear-gradient(90deg, #c9a87b, #9e7b53);
          border-radius: 2px;
        }

        .decoration-dot {
          width: 8px;
          height: 8px;
          background: #bf5700;
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(191, 87, 0, 0.2);
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 70px;
          align-items: center;
          background: rgba(255, 250, 245, 0.75);
          backdrop-filter: blur(12px);
          border-radius: 48px;
          padding: 50px 60px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(255, 245, 235, 0.9);
          transition: all 0.4s ease;
        }

        .about-content:hover {
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.2);
          border-color: rgba(201, 168, 123, 0.3);
        }

        /* Galerie */
        .about-gallery {
          position: relative;
          width: 100%;
          min-height: 480px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .gallery-grid {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: 450px;
        }

        .gallery-item {
          position: absolute;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 40px -15px rgba(0, 0, 0, 0.25);
          transition: all 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          cursor: pointer;
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .gallery-item:hover {
          transform: translateY(-8px) scale(1.02);
          z-index: 10;
          box-shadow: 0 30px 50px -15px rgba(0, 0, 0, 0.35);
        }

        .gallery-item:hover .gallery-img {
          transform: scale(1.05);
        }

        .img-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          color: white;
          padding: 20px 15px 10px;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          backdrop-filter: blur(2px);
        }

        .gallery-item:hover .img-caption {
          opacity: 1;
          transform: translateY(0);
        }

        .item-1 {
          width: 65%;
          height: 280px;
          top: 0;
          left: 0;
          z-index: 3;
          transform: rotate(-3deg);
        }

        .item-2 {
          width: 60%;
          height: 260px;
          bottom: 0;
          right: 0;
          z-index: 2;
          transform: rotate(2deg);
        }

        .item-3 {
          width: 55%;
          height: 240px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(0deg);
          z-index: 4;
          border: 3px solid white;
          box-shadow: 0 30px 45px -15px rgba(0, 0, 0, 0.3);
        }

        .item-3:hover {
          transform: translate(-50%, -50%) scale(1.02);
        }

        .gallery-glow {
          position: absolute;
          bottom: -10px;
          left: 10%;
          width: 80%;
          height: 60px;
          background: radial-gradient(ellipse, rgba(191, 87, 0, 0.2), transparent);
          filter: blur(20px);
          border-radius: 50%;
          z-index: 0;
          pointer-events: none;
        }

        /* Texte principal */
        .about-text {
          color: #3e2c21;
          line-height: 1.75;
          font-size: 1.08rem;
          font-weight: 400;
        }

        .about-text p {
          margin-bottom: 30px;
          text-align: left;
          letter-spacing: -0.01em;
        }

        .highlight {
          color: #bf5700;
          font-weight: 600;
          background: linear-gradient(120deg, rgba(191, 87, 0, 0.1) 0%, rgba(191, 87, 0, 0.05) 100%);
          padding: 0 6px;
          border-radius: 8px;
        }

        /* Témoignage élégant */
        .testimonial {
          margin: 40px 0 30px;
          padding: 28px 32px;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(8px);
          border-radius: 32px;
          border: 1px solid rgba(201, 168, 123, 0.3);
          position: relative;
          transition: all 0.3s ease;
        }

        .testimonial:hover {
          background: rgba(255, 255, 255, 0.7);
          border-color: rgba(201, 168, 123, 0.5);
          transform: translateY(-4px);
        }

        .quote-mark {
          font-size: 4rem;
          font-family: 'Playfair Display', serif;
          color: #c9a87b;
          opacity: 0.4;
          line-height: 1;
          position: absolute;
          top: 10px;
          left: 20px;
          pointer-events: none;
        }

        .testimonial-text {
          font-size: 1.15rem;
          font-style: italic;
          color: #2c1a12;
          margin: 0 0 20px 0;
          padding-left: 20px;
          font-weight: 450;
          letter-spacing: -0.2px;
        }

        .testimonial-author {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          border-top: 1px solid rgba(201, 168, 123, 0.3);
          padding-top: 16px;
        }

        .author-name {
          font-weight: 700;
          color: #bf5700;
          font-size: 0.95rem;
          letter-spacing: 1px;
        }

        .author-title {
          font-size: 0.75rem;
          color: #8b735a;
          margin-top: 4px;
        }

        .signature-line {
          display: flex;
          justify-content: flex-start;
          margin-top: 20px;
        }

        .signature-icon {
          font-size: 1.6rem;
          color: #c9a87b;
          opacity: 0.8;
          transition: opacity 0.3s;
        }

        /* Animation */
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .about-section {
          animation: fadeSlideUp 0.9s ease-out forwards;
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .about-content {
            gap: 50px;
            padding: 45px;
          }
          .section-title {
            font-size: 2.8rem;
          }
          .gallery-grid {
            height: 400px;
          }
          .item-1 { height: 240px; }
          .item-2 { height: 220px; }
          .item-3 { height: 200px; }
        }

        @media (max-width: 900px) {
          .about-page {
            padding: 110px 20px 80px;
          }
          .about-content {
            grid-template-columns: 1fr;
            gap: 55px;
            padding: 45px 35px;
            text-align: center;
          }
          .about-gallery {
            min-height: 420px;
          }
          .gallery-grid {
            height: 380px;
            max-width: 450px;
            margin: 0 auto;
          }
          .about-text p {
            text-align: center;
          }
          .testimonial-text {
            text-align: center;
            padding-left: 0;
          }
          .quote-mark {
            left: 50%;
            transform: translateX(-50%);
            top: 0;
          }
          .testimonial-author {
            align-items: center;
          }
          .signature-line {
            justify-content: center;
          }
          .section-title {
            font-size: 2.4rem;
          }
        }

        @media (max-width: 640px) {
          .about-page {
            padding: 90px 15px 60px;
          }
          .section-title {
            font-size: 2rem;
          }
          .about-content {
            padding: 30px 20px;
            border-radius: 36px;
          }
          .gallery-grid {
            height: 320px;
          }
          .item-1 { height: 200px; width: 70%; }
          .item-2 { height: 180px; width: 65%; }
          .item-3 { height: 160px; width: 60%; }
          .about-text {
            font-size: 0.95rem;
          }
          .testimonial {
            padding: 20px 20px;
          }
          .testimonial-text {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .gallery-grid {
            height: 280px;
          }
          .item-1 { height: 170px; }
          .item-2 { height: 150px; }
          .item-3 { height: 140px; }
          .section-title {
            font-size: 1.8rem;
          }
          .decoration-line {
            width: 30px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-section,
          .gallery-item,
          .gallery-img,
          .testimonial {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default About;