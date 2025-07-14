/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "utfs.io",
    //     pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/**`,
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "img.clerk.com",
    //     pathname: `/*`,
    //   },
    // ],
    domains: ["utfs.io", "img.clerk.com"],
  },
  rewrites: () => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag",
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      loader: "node-loader",
    });

    return config;
  },
};

export default nextConfig;
