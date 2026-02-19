#!/bin/bash

# Script to generate PNG icons from the SVG using ImageMagick or similar tools
# Run this after installing a PNG conversion tool

# Install ImageMagick if needed:
# macOS: brew install imagemagick
# Linux: sudo apt-get install imagemagick
# Windows: Download from https://imagemagick.org/

# Generate different sizes from the SVG
convert -background none -density 192 public/icon.svg -resize 192x192 public/icon-192.png
convert -background none -density 512 public/icon.svg -resize 512x512 public/icon-512.png
convert -background none -density 96 public/icon.svg -resize 96x96 public/icon-96.png

# Generate maskable icons (for adaptive icons on Android 8+)
convert -background none -density 192 public/icon.svg -resize 192x192 -extent 192x192 -gravity center public/icon-192-maskable.png
convert -background none -density 512 public/icon.svg -resize 512x512 -extent 512x512 -gravity center public/icon-512-maskable.png

# Generate splash screens
convert -size 540x720 xc:white -fill '#3b82f6' -draw 'polygon 0,0 540,0 540,720 0,720' \
  -gravity center -pointsize 36 -fill white -annotate 0 'Budget Planner' \
  public/splash-192.png

convert -size 1280x720 xc:white -fill '#3b82f6' -draw 'polygon 0,0 1280,0 1280,720 0,720' \
  -gravity center -pointsize 48 -fill white -annotate 0 'Budget Planner' \
  public/splash-512.png

echo "Icons generated successfully!"
