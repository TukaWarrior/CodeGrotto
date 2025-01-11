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

public class FilePlugin1 implements Plugin<String> {
    private final Observable<String> output = new Observable<>();
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private String outputFilePath; // Path to the output file

    @Override
    public Observable<String> getOutput() {
        return output;
    }

    @Override
    public void setInput(Observable<String> input) {
        // Subscribe to the input observable and overwrite the output file with the new data
        input.subscribe(data -> {
            if (outputFilePath != null) {
                overwriteFile(outputFilePath, data); // Overwrite the output file
            } else {
                System.err.println("Output file path is not set!");
            }
        });
    }

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
                            output.emit(content); // Emit the entire file content
                        }
                    }
                    key.reset();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    public void setOutputFilePath(String filePath) {
        this.outputFilePath = filePath; // Set the output file path
    }

    private void overwriteFile(String filePath, String content) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, false))) { // Overwrite mode
            writer.write(content);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
