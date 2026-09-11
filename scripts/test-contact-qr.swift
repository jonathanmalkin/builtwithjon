// macOS-only independent decoder. Pass generated PNG and rasterized SVG paths.
import Foundation
import Vision
guard CommandLine.arguments.count > 1 else {
    FileHandle.standardError.write(Data("Pass one or more QR image paths.\n".utf8))
    exit(2)
}
for file in CommandLine.arguments.dropFirst() {
    let request = VNDetectBarcodesRequest()
    request.symbologies = [.qr]
    try VNImageRequestHandler(url: URL(fileURLWithPath: file)).perform([request])
    guard let results = request.results, results.count == 1,
          results[0].payloadStringValue == "https://builtwithjon.com/card/" else {
        FileHandle.standardError.write(Data("QR validation failed: \(file)\n".utf8))
        exit(1)
    }
    print("PASS QR decode: \(URL(fileURLWithPath: file).lastPathComponent)")
}
