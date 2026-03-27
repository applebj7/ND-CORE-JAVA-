package com.example.main;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Stream;
import java.util.stream.Collectors;

@RestController
public class FileSearchController {

    @PostMapping("/search")
    public ResponseEntity<?> searchFiles(@RequestBody Map<String, String> params) {
        String query = params.getOrDefault("query", "").toLowerCase();
        String searchType = params.getOrDefault("searchType", "name");

        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> slots = new ArrayList<>();

        Path rootPath = Paths.get("C:\\"); 

        System.out.println("******************************************");
        System.out.println("rootPath : " + rootPath.toAbsolutePath());
        System.out.println("******************************************");

        List<Path> foundFiles = new ArrayList<>();

        try {
            // Files.walkFileTree를 사용하여 AccessDeniedException 발생 시 건너뛰도록 설정
            Files.walkFileTree(rootPath, EnumSet.noneOf(FileVisitOption.class), 3, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                    if (foundFiles.size() >= 20) return FileVisitResult.TERMINATE;

                    String fileName = file.getFileName().toString().toLowerCase();
                    boolean isMatch = false;

                    if ("name".equals(searchType)) {
                        isMatch = fileName.contains(query);
                    } else {
                        isMatch = isContentMatch(file, query);
                    }

                    if (isMatch) foundFiles.add(file);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFileFailed(Path file, IOException exc) {
                    // 접근 권한 오류(AccessDeniedException) 발생 시 해당 파일/폴더 무시하고 계속 진행
                    return FileVisitResult.CONTINUE;
                }
            });

            for (Path path : foundFiles) {
                BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);
                Map<String, Object> fileInfo = new HashMap<>();
                fileInfo.put("name", path.getFileName().toString());
                fileInfo.put("path", path.toAbsolutePath().toString());
                fileInfo.put("size", formatSize(attrs.size()));
                fileInfo.put("modified", formatDateTime(attrs.lastModifiedTime().toMillis()));
                
                if ("content".equals(searchType)) {
                    fileInfo.put("snippet", getSnippet(path, query));
                }

                Map<String, Object> slot = new HashMap<>();
                slot.put("file_info", fileInfo);
                slots.add(slot);
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }

        result.put("slots", slots);
        return ResponseEntity.ok(result);
    }

    private boolean isContentMatch(Path path, String query) {
        try {
            // 간단한 텍스트 파일 체크 (확장자 기반)
            String name = path.getFileName().toString().toLowerCase();
            if (name.endsWith(".txt") || name.endsWith(".java") || name.endsWith(".py") || name.endsWith(".html") || name.endsWith(".js")) {
                String content = Files.readString(path, StandardCharsets.UTF_8);
                return content.toLowerCase().contains(query);
            }
        } catch (Exception e) { return false; }
        return false;
    }

    private String getSnippet(Path path, String query) {
        try {
            String content = Files.readString(path, StandardCharsets.UTF_8);
            int idx = content.toLowerCase().indexOf(query.toLowerCase());
            if (idx != -1) {
                int start = Math.max(0, idx - 20);
                int end = Math.min(content.length(), idx + query.length() + 20);
                return "..." + content.substring(start, end).replace("\n", " ") + "...";
            }
        } catch (Exception e) { return ""; }
        return "";
    }

    private String formatSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        return String.format("%.1f %cB", bytes / Math.pow(1024, exp), "KMGTPE".charAt(exp - 1));
    }

    private String formatDateTime(long millis) {
        return java.time.Instant.ofEpochMilli(millis)
                .atZone(ZoneId.systemDefault())
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}