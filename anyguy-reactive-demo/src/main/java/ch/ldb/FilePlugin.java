package ch.ldb;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class FilePlugin {
    private final Observable<String> fileDataStream = new Observable<>();
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    // Returns the observable stream for file data
    public Observable<String> getFileDataStream() {
        return fileDataStream;
    }

    // Watches the file for changes and emits its content
    public void watchFile(String filePath) {
        executor.submit(() -> {
            try {
                WatchService watchService = FileSystems.getDefault().newWatchService();
                Path path = Paths.get(filePath).getParent();

                if (path == null) {
                    path = Paths.get(".").toAbsolutePath().normalize();
                }

                path.register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);

                while (true) {
                    WatchKey key = watchService.take();
                    for (WatchEvent<?> event : key.pollEvents()) {
                        if (event.context().toString().equals(Paths.get(filePath).getFileName().toString())) {
                            String content = Files.readString(Paths.get(filePath));
                            fileDataStream.emit(content); // Emit file content
                        }
                    }
                    key.reset();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    // Writes content to the specified file
    public void writeFile(String filePath, String content) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, false))) {
            writer.write(content);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
