const Footer = () => {
  const contacs = [
    {
      src: "/logo/facebook.svg",
      alt: "fb",
    },
    {
      src: "/logo/twitter.svg",
      alt: "twt",
    },
    {
      src: "/logo/youtube.svg",
      alt: "yt",
    },
    {
      src: "/logo/instagram.svg",
      alt: "ig",
    },
    {
      src: "/logo/linkedin.svg",
      alt: "ld",
    },
    {
      src: "/logo/line.svg",
      alt: "line",
    },
  ];

  return (
    <>
      <footer className="w-screen px-20 py-10 flex flex-row items-center justify-between">
        <div className="space-y-3.5">
          <img src="/logo/jitu.png" alt="logo" className="w-32" />
          <p className="font-poppins text-sm text-blue-700">© 2025 Jitu PTN</p>
        </div>

        <div className="flex flex-row gap-6">
          {contacs.map(({ src, alt }, index) => (
            <img src={src} alt={alt} key={index} className="w-6 h-6" />
          ))}
        </div>
      </footer>
    </>
  );
};

export default Footer;
