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
import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

// Observable class for reactive streams
class Observable<T> {
    private Consumer<T> observer;

    public void subscribe(Consumer<T> observer) {
        this.observer = observer;
    }

    public void emit(T data) {
        if (observer != null) {
            observer.accept(data);
        }
    }
}

// File Plugin: Reads from and writes to files
class FilePlugin {
    private final Observable<String> fileDataStream = new Observable<>();
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    public Observable<String> getFileDataStream() {
        return fileDataStream;
    }

    public void watchFile(String filePath) {
        executor.submit(() -> {
            try {
                WatchService watchService = FileSystems.getDefault().newWatchService();
                Path path = Paths.get(filePath).getParent();
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

    public void writeFile(String filePath, String content) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath, false))) {
            writer.write(content);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

// Format Plugin: Transforms the data
class FormatPlugin {
    public String transformInput(String data) {
        return "In: " + data;
    }

    public String transformOutput(String data) {
        return "Out: " + data;
    }
}

// Main Application
public class ReactivePipelineTest {
    public static void main(String[] args) {
        // File paths
        String inputFilePath = "src\\main\\java\\ch\\ldb\\input.txt";
        String outputFilePath = "src\\main\\java\\ch\\ldb\\output.txt";

        // Create plugins
        FilePlugin filePlugin = new FilePlugin();
        FormatPlugin formatPlugin = new FormatPlugin();

        // Watch the input file for changes
        filePlugin.watchFile(inputFilePath);

        // Observable for terminal input
        Observable<String> terminalInputStream = new Observable<>();

        // Stage 1: Read from input.txt and transform
        filePlugin.getFileDataStream().subscribe(data -> {
            String transformed = formatPlugin.transformInput(data);
            System.out.println("From input.txt: " + transformed); // Display in terminal
        });

        // Stage 2: Read from terminal, transform, and write to output.txt
        terminalInputStream.subscribe(data -> {
            String transformed = formatPlugin.transformOutput(data);
            filePlugin.writeFile(outputFilePath, transformed);
        });

        // Start a thread to read terminal input
        ExecutorService terminalExecutor = Executors.newSingleThreadExecutor();
        terminalExecutor.submit(() -> {
            Scanner scanner = new Scanner(System.in);
            System.out.println("Type something in the terminal (it will be written to output.txt):");
            while (true) {
                String input = scanner.nextLine();
                terminalInputStream.emit(input); // Emit terminal input
            }
        });
    }
}