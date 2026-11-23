/** @type {import('next').NextConfig} */
const nextConfig = {
  // hide the floating "N" dev-tools button (it sat on top of the mobile tab bar);
  // compile and runtime errors still show in an overlay
  devIndicators: false,
};

export default nextConfig;
