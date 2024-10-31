package tcc.leroma.pivestudo.interop;

import aj.org.objectweb.asm.commons.TryCatchBlockSorter;
import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecutor;
import org.apache.commons.exec.ExecuteException;
import org.apache.commons.exec.PumpStreamHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tcc.leroma.pivestudo.PivestudoApp;

import java.io.*;
import java.util.List;
import java.util.stream.Collectors;

public class CallScripts {

    private static final Logger LOG = LoggerFactory.getLogger(CallScripts.class);

    public String callPythonScript(String parameter) { // throws ExecuteException, IOException {

        String resultadoScript = "";

        try {
/*
            String line = resolvePythonScriptPath(".venv/bin/python ")
                + resolvePythonScriptPath("identificador.py")
                + " '" + parameter + "' ";
            LOG.info("comando que sera executado: [{}]", line);

            CommandLine cmdLine = CommandLine.parse(line);
            */
            CommandLine cmdLine = new CommandLine( resolvePythonScriptPath(".venv/bin/python") );
            cmdLine.addArgument( resolvePythonScriptPath("identificador.py") );
            cmdLine.addArgument( parameter );

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PumpStreamHandler streamHandler = new PumpStreamHandler(outputStream);

            DefaultExecutor executor = new DefaultExecutor();
            executor.setStreamHandler(streamHandler);

            int exitCode = executor.execute(cmdLine);

            LOG.info("exitCode: {}", exitCode);

            if(0 == exitCode) {
                LOG.info("No errors should be detected");
                resultadoScript = outputStream.toString();

            } else {
                LOG.info("Errors detected");
                LOG.info("outputStream.toString(): {}", outputStream.toString());
                resultadoScript = "";
            }

        } catch (ExecuteException ee){
            LOG.warn("Capturada ExecuteException", ee);
        } catch (IOException ioe){
            LOG.warn("Capturada IOException", ioe);
        } catch (Exception e) {
            LOG.warn("Capturada Exception", e);
        }

        return resultadoScript;
    }

    private List<String> readProcessOutput(InputStream inputStream) throws IOException {
        try (BufferedReader output = new BufferedReader(new InputStreamReader(inputStream))) {
            return output.lines().collect(Collectors.toList());
        }
    }

    private String resolvePythonScriptPath(String filename) {
        File file = new File("./pythonDetectImages/" + filename);

        return file.getAbsolutePath();
    }

}
