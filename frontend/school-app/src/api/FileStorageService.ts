// // service/FileStorageService.java
// public String storeFile(MultipartFile file) throws IOException {
//     Path uploadPath = Paths.get(uploadDir);
//     if (!Files.exists(uploadPath)) {
//         Files.createDirectories(uploadPath);
//     }

//     String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//     Path filePath = uploadPath.resolve(fileName);
//     Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

//     // Return the web‑accessible path (relative to the server root)
//     return "/uploads/" + fileName;
// }