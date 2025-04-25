package game;

import java.io.IOException;
import java.util.Map;

import fi.iki.elonen.NanoHTTPD;

public class App extends NanoHTTPD {

    public static void main(String[] args) {
        try {
            new App();
        } catch (IOException ioe) {
            System.err.println("Couldn't start server:\n" + ioe);
        }
    }

    private Game game;

    public App() throws IOException {
        super(8080);
        this.game = new Game();
        start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
        System.out.println("\nRunning!\n");
    }

    @Override
public Response serve(IHTTPSession session) {
    String uri = session.getUri();
    Map<String, String> params = session.getParms();

    if (uri.equals("/newgame")) {
        this.game = new Game();
    } else if (uri.equals("/play")) {
        int x = Integer.parseInt(params.get("x"));
        int y = Integer.parseInt(params.get("y"));
        this.game = this.game.play(x, y);
    } else if (uri.equals("/undo")) {
        this.game = this.game.undo();
    } else if (uri.equals("/currentplayer")) {
        String currentPlayer = this.game.getPlayer() == Player.PLAYER0 ? "X" : "O";
        return newFixedLengthResponse(String.format("{ \"currentPlayer\": \"%s\" }", currentPlayer));
    } else if (uri.equals("/checkwinner")) {
        Player winner = this.game.getWinner();
        String winnerText = winner == null ? null : (winner == Player.PLAYER0 ? "X" : "O");
        return newFixedLengthResponse(String.format("{ \"winner\": %s }", 
            winnerText == null ? "null" : "\"" + winnerText + "\""));
    }

    GameState gameplay = GameState.forGame(this.game);
    return newFixedLengthResponse(gameplay.toString());
}

}
