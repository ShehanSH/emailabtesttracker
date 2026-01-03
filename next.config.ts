import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  // Mark server-only packages as external
  serverExternalPackages: [
    'bcryptjs',
    'firebase-admin',
    '@auth/firebase-adapter',
  ],
  
  // Configure webpack to handle Node.js built-in modules
  webpack: (config, { isServer }) => {
    // Add plugin to handle node: protocol imports by replacing them
    config.plugins = config.plugins || [];
    
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^node:/,
        (resource) => {
          resource.request = resource.request.replace(/^node:/, '');
        }
      )
    );
    
    // Mark firebase-admin and its problematic dependencies as external
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          'firebase-admin': 'commonjs firebase-admin',
          '@fastify/busboy': 'commonjs @fastify/busboy',
          'dicer': 'commonjs dicer',
        });
      }
    }
    
    // For both server and client: ignore firebase-admin dependencies that use Node.js modules
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(@fastify\/busboy|dicer)$/,
        contextRegExp: /node_modules\/firebase-admin/,
      })
    );
    
    if (!isServer) {
      // Client-side: completely ignore server-only modules
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(firebase-admin|bcryptjs|@auth\/firebase-adapter)$/,
        })
      );
      
      // Client-side fallbacks
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: require.resolve('process/browser'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util'),
        crypto: false,
        fs: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        child_process: false,
        'firebase-admin': false,
        'bcryptjs': false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
