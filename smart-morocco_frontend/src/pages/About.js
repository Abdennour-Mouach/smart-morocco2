import React from "react";

const About = () => {
  return (
    <div className="about-page">
      {/* About Section */}
      <section className="about-section">
        <div className="section-header">
           <div>
              <span className="section-subtitle">Découvrez</span>
              <h2 className="section-title">À PROPOS <div className="title-decoration"></div></h2>
            </div>
        </div>
        
        <div className="about-content">
          <div className="about-images">
            <div className="image-stack">
              <img
                src="images/ESSAOUIRA.jpg"
                alt="Essaouira"
                className="about-img img-back"
              />
              <img
                src="images/Hassan2.jpg"
                alt="Mosquée Hassan II"
                className="about-img img-front"
              />
            </div>
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
            <div className="signature-line"></div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page {
          background: linear-gradient(135deg, #fefaf5 0%, #fff8f0 100%);
          padding: 120px 20px 100px;
          position: relative;
          overflow: hidden;
        }

        .about-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 600px;
          background: radial-gradient(circle at 0% 0%, rgba(75, 47, 180, 0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        /* About Section */
        .about-section {
          max-width: 1500px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .section-subtitle {
          display: block;
          color: #bf5700;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .about-title {
          font-size: 3rem;
          font-weight: 300;
          color: #2c1810;
          margin: 0 0 20px;
          letter-spacing: 2px;
          position: relative;
          display: inline-block;
        }

        .title-decoration {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, #c9a87b, #8b6b42);
          margin: 0 auto;
        }

        .about-content {
          height:450px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          backdrop-filter: blur(10px);
          border-radius: 30px;
          padding: 50px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .about-images {
          position: relative;
        }

        .image-stack {
          position: relative;
          min-height: 320px;
        }

        .about-img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          border-radius: 20px;
          transition: all 0.4s ease;
        }

        .img-back {
          position: absolute;
          top: 0;
          left: 0;
          width: 85%;
          filter: brightness(0.95);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .img-front {
          position: absolute;
          bottom: -60px;
          right: -100px;
          width: 85%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border: 3px solid white;
        }

        .about-img:hover {
          transform: translateY(-5px);
        }

        .about-text {
          color: #4a3b2c;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        .about-text p {
          margin-bottom: 25px;
          font-weight: 400;
          margin-left:100px;
        }

        .highlight {
          color: #8b6b42;
          font-weight: 600;
          position: relative;
          display: inline-block;
        }

        .signature-line {
          width: 50px;
          height: 2px;
          background: linear-gradient(90deg, #c9a87b, transparent);
          margin-top: 30px;
        }
        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e272e;
          margin: 0;
        }


        /* Responsive Design */
        @media (max-width: 1024px) {
          .about-content {
            gap: 40px;
            padding: 40px;
          }

          .about-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 900px) {
          .about-page {
            padding: 100px 20px 80px;
          }

          .about-content {
            grid-template-columns: 1fr;
            gap: 50px;
            padding: 40px 30px;
          }

          .image-stack {
            min-height: 280px;
            max-width: 500px;
            margin: 0 auto;
          }

          .about-img {
            height: 250px;
          }

          .about-text {
            text-align: center;
          }

          .signature-line {
            margin: 30px auto 0;
          }
        }

        @media (max-width: 640px) {
          .about-title {
            font-size: 2rem;
          }

          .section-subtitle {
            font-size: 0.8rem;
            letter-spacing: 2px;
          }

          .about-content {
            padding: 30px 20px;
          }

          .image-stack {
            min-height: 240px;
          }

          .about-img {
            height: 200px;
          }

          .img-back,
          .img-front {
            width: 90%;
          }

          .about-text {
            font-size: 0.95rem;
            line-height: 1.7;
          }
        }

        @media (max-width: 480px) {
          .about-page {
            padding: 80px 15px 60px;
          }

          .about-title {
            font-size: 1.8rem;
          }

          .image-stack {
            min-height: 200px;
          }

          .about-img {
            height: 170px;
          }

          .img-front {
            bottom: -10px;
          }
        }

        /* Smooth animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .about-section {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default About;