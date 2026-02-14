import { Helmet } from "@dr.pogodin/react-helmet";
import logo from "../assets/images/logo2.png";

const SEO = ({
  title = "TK Production Film | Best Photography & Cinematography",
  description = "Capture your special moments with TK Production Film. We offer expert wedding, pre-wedding, engagement, and event photography services. Book now!",
  keywords = "photography, cinematography, wedding photography, pre-wedding, baby shower, birthday photography, civil marriage, engagement portraits, TK Production Film",
  url = "https://tkproductionfilm.com",
  image = logo,
  author = "TK Production Film",
  type = "website",
}) => {
  const fullImageUrl = image?.startsWith("https")
    ? image
    : `${url.replace(/\/$/, "")}/${image.replace(/^\//, "")}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "TK Production Film",
    url,
    description,
    logo: fullImageUrl,
    email: "tkproductionfilm@gmail.com",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+44 7884 537171",
        contactType: "customer support",
        areaServed: "GB",
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        telephone: "+91 9725621316",
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: "English, Hindi",
      },
    ],
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "506a Ladymargret Road",
        addressLocality: "Southall",
        addressRegion: "London",
        postalCode: "UB1 2NP",
        addressCountry: "GB",
      },
      {
        "@type": "PostalAddress",
        streetAddress:
          "Nathani Complex Blue Stars Building 6th Floor 604, Near Millenium Hospital, Kausa Mumbra",
        addressLocality: "Thane",
        addressRegion: "Maharashtra",
        postalCode: "400612",
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Main Bazar Near SBI Bank",
        addressLocality: "Diu",
        postalCode: "362520",
        addressCountry: "IN",
      },
    ],
    sameAs: [
      "https://www.youtube.com/@tkproductionfilm",
      "https://www.instagram.com/tk_production_film",
      "https://www.facebook.com/tkproductionfilm",
      "https://www.tiktok.com/@takproductionsltd",
    ],
  };

  return (
    <Helmet
      htmlAttributes={{ lang: "en" }}
      titleTemplate="%s | TK Production Film"
      defaultTitle="TK Production Film"
    >
      {/* Basic Meta */}
      <meta charSet="UTF-8" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="robots" content="index, follow" />
      <meta name="format-detection" content="telephone=no" />

      {/* Title & Description */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Favicon */}
      <link rel="icon" href={fullImageUrl} type="image/png" sizes="32x32" />
      <link rel="apple-touch-icon" href={fullImageUrl} />

      {/* Microdata */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={fullImageUrl} />

      {/* Open Graph */}
      <meta property="og:site_name" content="TK Production Film" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content="TK Production Film Logo" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="en_GB" />
      <meta property="og:locale:alternate" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tkproductionfilm" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:creator" content="@tkproductionfilm" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
