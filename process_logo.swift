import Foundation
import AppKit

let srcPath = "/Users/roosstudiox/.gemini/antigravity/brain/64758923-4c19-4829-9517-be5fafa35dff/.user_uploaded/media_1787080307410.png"
let destPath = "/Users/roosstudiox/Documents/Roos StudioX/assets/logo-white-wordmark.png"

guard let image = NSImage(contentsOfFile: srcPath),
      let tiffData = image.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiffData) else {
    print("Failed to load image")
    exit(1)
}

let width = bitmap.pixelsWide
let height = bitmap.pixelsHigh

guard let newBitmap = NSBitmapImageRep(
    bitmapRect: NSRect(x: 0, y: 0, width: width, height: height),
    colorSpace: NSColorSpace.sRGB,
    bitsPerSample: 8,
    samplesPerPixel: 4,
    hasAlpha: true,
    isPlanar: false,
    colorSpaceName: .calibratedRGB,
    bytesPerRow: width * 4,
    bitsPerPixel: 32
) else {
    print("Failed to create bitmap")
    exit(1)
}

var minX = width
var minY = height
var maxX = 0
var maxY = 0

for y in 0..<height {
    for x in 0..<width {
        let color = bitmap.colorAt(x: x, y: y) ?? NSColor.white
        let r = color.redComponent
        let g = color.greenComponent
        let b = color.blueComponent
        let brightness = (r + g + b) / 3.0
        
        if brightness < 0.75 { // Dark stroke pixel
            let alpha = CGFloat(1.0 - (brightness / 0.75))
            let whiteColor = NSColor(red: 1.0, green: 1.0, blue: 1.0, alpha: alpha)
            newBitmap.setColor(whiteColor, atX: x, y: y)
            
            if x < minX { minX = x }
            if x > maxX { maxX = x }
            if y < minY { minY = y }
            if y > maxY { maxY = y }
        } else {
            let clearColor = NSColor(red: 0, green: 0, blue: 0, alpha: 0)
            newBitmap.setColor(clearColor, atX: x, y: y)
        }
    }
}

let cropWidth = max(1, maxX - minX + 1)
let cropHeight = max(1, maxY - minY + 1)

guard let croppedBitmap = NSBitmapImageRep(
    bitmapRect: NSRect(x: 0, y: 0, width: cropWidth, height: cropHeight),
    colorSpace: NSColorSpace.sRGB,
    bitsPerSample: 8,
    samplesPerPixel: 4,
    hasAlpha: true,
    isPlanar: false,
    colorSpaceName: .calibratedRGB,
    bytesPerRow: cropWidth * 4,
    bitsPerPixel: 32
) else {
    print("Failed to crop")
    exit(1)
}

for y in minY...maxY {
    for x in minX...maxX {
        let color = newBitmap.colorAt(x: x, y: y) ?? NSColor.clear
        croppedBitmap.setColor(color, atX: x - minX, y: y - minY)
    }
}

if let pngData = croppedBitmap.representation(using: .png, properties: [:]) {
    try? pngData.write(to: URL(fileURLWithPath: destPath))
    print("SUCCESS: Processed white transparent logo to \(destPath)")
}
