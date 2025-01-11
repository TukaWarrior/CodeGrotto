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
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class FilePlugin2 implements Plugin<String> {
    private final Observable<String> output = new Observable<>();
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private long lastLineCount = 0; // Tracks the number of lines in the input file
    private String outputFilePath; // Path to the output file

    @Override
    public Observable<String> getOutput() {
        return output;
    }

    @Override
    public void setInput(Observable<String> input) {
        // Subscribe to the input observable and append the data to the output file
        input.subscribe(data -> {
            if (outputFilePath != null) {
                appendToFile(outputFilePath, data); // Append to the configured output file
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
                            List<String> lines = Files.readAllLines(Paths.get(filePath));
                            if (lines.size() > lastLineCount) {
                                // Get the newest line
                                String newLine = lines.get(lines.size() - 1);
                                lastLineCount = lines.size(); // Update the line count
                                output.emit(newLine); // Emit the newest line
                            }
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

    private void appendToFile(String filePath, String content) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, true))) { // Append mode
            writer.write(content);
            writer.newLine();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
