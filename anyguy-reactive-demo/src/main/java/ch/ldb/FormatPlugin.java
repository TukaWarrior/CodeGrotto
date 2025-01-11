package ch.ldb;

public class FormatPlugin {
    public String transformInput(String data) {
        return "In: " + data;
    }

    public String transformOutput(String data) {
        return "Out: " + data;
    }
}
