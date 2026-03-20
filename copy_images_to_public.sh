#!/bin/bash

# ============================================
# COPY IMAGES TO PUBLIC FOLDER
# ============================================
# This script copies all images from backend/uploads/website 
# to public/website for production deployment
# ============================================

SOURCE_DIR="/home/aufa/Public/RebuildV2/backend/uploads/website"
DEST_DIR="/home/aufa/Public/RebuildV2/public/website"

echo "============================================"
echo "  COPY IMAGES TO PUBLIC FOLDER"
echo "============================================"
echo ""
echo "Source: $SOURCE_DIR"
echo "Destination: $DEST_DIR"
echo ""

# Check if source exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "ERROR: Source directory not found: $SOURCE_DIR"
    exit 1
fi

# Create destination if not exists
if [ ! -d "$DEST_DIR" ]; then
    echo "Creating destination directory..."
    mkdir -p "$DEST_DIR"
fi

# Copy files
echo "Copying images..."
echo ""

# Use rsync if available, otherwise use cp
if command -v rsync &> /dev/null; then
    echo "Using rsync..."
    rsync -av --progress "$SOURCE_DIR/" "$DEST_DIR/"
else
    echo "Using cp..."
    cp -rv "$SOURCE_DIR"/* "$DEST_DIR/"
fi

echo ""
echo "============================================"
echo "  COPY COMPLETED"
echo "============================================"
echo ""

# Count files
SOURCE_COUNT=$(ls -1 "$SOURCE_DIR" | wc -l)
DEST_COUNT=$(ls -1 "$DEST_DIR" | wc -l)

echo "Source files: $SOURCE_COUNT"
echo "Destination files: $DEST_COUNT"
echo ""

# Show sample files
echo "Sample files in destination:"
ls -1 "$DEST_DIR" | head -10

echo ""
echo "✅ Images ready for production!"
