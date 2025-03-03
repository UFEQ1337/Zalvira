"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { casinoService } from "@/lib/api/casino-service";
import { Wallet, DollarSign, RotateCcw, Plus, Minus } from "lucide-react";

// Typy kart w grze blackjack
const CARD_SUITS = ["♠️", "♥️", "♦️", "♣️"];
const CARD_VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

// Komponent renderujący kartę
function PlayingCard({ value, hidden = false, isDealer = false }) {
  // Konwertuj liczbową wartość na kartę (A-K)
  const getCardDisplay = (val: number) => {
    if (val === 1 || val === 11) return "A";
    if (val >= 2 && val <= 10) return val.toString();
    if (val === 10) return CARD_VALUES[Math.floor(Math.random() * 4) + 9]; // Losowo J, Q, K
    return "?";
  };

  // Losowy kolor (czerwony/czarny) i symbol
  const isRed = Math.random() > 0.5;
  const suit = CARD_SUITS[Math.floor(Math.random() * CARD_SUITS.length)];
  const cardValue = getCardDisplay(value);

  return (
    <motion.div
      initial={{ rotateY: hidden ? 180 : 0, opacity: 0, scale: 0.8 }}
      animate={{ rotateY: hidden ? 180 : 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-20 h-32 rounded-lg relative ${
        hidden ? "bg-purple-700" : "bg-white shadow-md"
      } flex flex-col justify-between p-2`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {!hidden && (
        <>
          <div
            className={`text-lg font-bold ${
              isRed ? "text-red-600" : "text-black"
            }`}
          >
            {cardValue}
          </div>
          <div
            className={`text-2xl ${
              isRed ? "text-red-600" : "text-black"
            } self-center`}
          >
            {suit}
          </div>
          <div
            className={`text-lg font-bold ${
              isRed ? "text-red-600" : "text-black"
            } self-end`}
          >
            {cardValue}
          </div>
        </>
      )}

      {hidden && (
        <div
          className="absolute inset-0 bg-purple-700 border-2 border-purple-500 rounded-lg flex items-center justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-2xl text-white font-bold">?</div>
        </div>
      )}
    </motion.div>
  );
}

export default function BlackjackGame() {
  const { toast } = useToast();
  const [playerCards, setPlayerCards] = useState<number[]>([]);
  const [dealerCards, setDealerCards] = useState<number[]>([]);
  const [secondCardHidden, setSecondCardHidden] = useState(true);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [dealerTotal, setDealerTotal] = useState(0);
  const [bet, setBet] = useState(25);
  const [balance, setBalance] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [winAmount, setWinAmount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameHistory, setGameHistory] = useState<
    { result: string; amount: number }[]
  >([]);

  // Kalkulator wartości kart (uwzględnia asy jako 1 lub 11)
  const calculateHandValue = (cards: number[]) => {
    let total = 0;
    let aces = 0;

    cards.forEach((card) => {
      if (card === 1 || card === 11) {
        aces += 1;
        total += 11;
      } else {
        total += Math.min(card, 10); // Figury (J,Q,K) mają wartość 10
      }
    });

    // Zmniejsz wartość asów, jeśli przekraczamy 21
    while (total > 21 && aces > 0) {
      total -= 10; // Zmień wartość asa z 11 na 1
      aces -= 1;
    }

    return total;
  };

  // Rozpoczęcie nowej gry
  const startGame = async () => {
    if (balance < bet) {
      toast({
        title: "Niewystarczające środki",
        description: "Nie masz wystarczających środków, aby zagrać.",
        variant: "destructive",
      });
      return;
    }

    setIsPlaying(true);
    setGameOver(false);
    setGameResult(null);
    setWinAmount(0);
    setSecondCardHidden(true);

    try {
      const response = await casinoService.playBlackjack(bet);

      setPlayerCards(response.playerCards);
      setDealerCards(response.dealerCards);
      setPlayerTotal(calculateHandValue(response.playerCards));
      setDealerTotal(calculateHandValue([response.dealerCards[0]])); // Ukryta druga karta

      // Na początek odejmiemy bet
      setBalance((prev) => prev - bet);

      // Sprawdzanie naturalnego blackjacka (21 od razu)
      const playerHasBlackjack =
        calculateHandValue(response.playerCards) === 21;

      if (playerHasBlackjack) {
        setSecondCardHidden(false);
        setDealerTotal(calculateHandValue(response.dealerCards));

        const dealerHasBlackjack =
          calculateHandValue(response.dealerCards) === 21;

        if (dealerHasBlackjack) {
          // Remis
          handleGameOver("push", bet);
        } else {
          // Wygrany blackjack (wypłata 3:2)
          const blackjackPayout = bet * 2.5;
          handleGameOver("blackjack", blackjackPayout);
        }
      }
    } catch (error) {
      console.error("Error starting blackjack game:", error);
      setIsPlaying(false);
      toast({
        title: "Błąd",
        description:
          "Wystąpił problem podczas rozpoczynania gry. Spróbuj ponownie.",
        variant: "destructive",
      });
    }
  };

  // Dobieranie karty
  const handleHit = async () => {
    if (!isPlaying || gameOver) return;

    // Losujemy nową kartę
    const newCard = Math.floor(Math.random() * 10) + 1;
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);

    const newTotal = calculateHandValue(newPlayerCards);
    setPlayerTotal(newTotal);

    // Sprawdzenie czy przekroczyliśmy 21
    if (newTotal > 21) {
      handleGameOver("bust", 0);
    }
  };

  // Zakończenie tury gracza
  const handleStand = async () => {
    if (!isPlaying || gameOver) return;

    setSecondCardHidden(false);
    const fullDealerTotal = calculateHandValue(dealerCards);
    setDealerTotal(fullDealerTotal);

    // Dobieranie kart przez krupiera (do 17)
    let currentDealerCards = [...dealerCards];
    let currentDealerTotal = fullDealerTotal;

    while (currentDealerTotal < 17) {
      const newCard = Math.floor(Math.random() * 10) + 1;
      currentDealerCards = [...currentDealerCards, newCard];
      currentDealerTotal = calculateHandValue(currentDealerCards);

      setDealerCards(currentDealerCards);
      setDealerTotal(currentDealerTotal);
    }

    // Określ wynik gry
    if (currentDealerTotal > 21) {
      // Krupier przekroczył 21, gracz wygrywa
      handleGameOver("win", bet * 2);
    } else if (currentDealerTotal > playerTotal) {
      // Krupier ma więcej, gracz przegrywa
      handleGameOver("lose", 0);
    } else if (playerTotal > currentDealerTotal) {
      // Gracz ma więcej, wygrywa
      handleGameOver("win", bet * 2);
    } else {
      // Remis
      handleGameOver("push", bet);
    }
  };

  // Podwojenie zakładu
  const handleDouble = async () => {
    if (!isPlaying || gameOver || playerCards.length !== 2 || balance < bet) {
      return;
    }

    // Pobieramy dodatkowy zakład
    setBalance((prev) => prev - bet);

    // Dobieramy jedną kartę
    const newCard = Math.floor(Math.random() * 10) + 1;
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);

    const newTotal = calculateHandValue(newPlayerCards);
    setPlayerTotal(newTotal);

    // Odkrywamy kartę krupiera i kończymy grę
    setSecondCardHidden(false);
    const fullDealerTotal = calculateHandValue(dealerCards);
    setDealerTotal(fullDealerTotal);

    let currentDealerCards = [...dealerCards];
    let currentDealerTotal = fullDealerTotal;

    while (currentDealerTotal < 17) {
      const newDealerCard = Math.floor(Math.random() * 10) + 1;
      currentDealerCards = [...currentDealerCards, newDealerCard];
      currentDealerTotal = calculateHandValue(currentDealerCards);
    }

    setDealerCards(currentDealerCards);
    setDealerTotal(currentDealerTotal);

    // Określ wynik gry (podwójny zakład)
    if (newTotal > 21) {
      handleGameOver("bust", 0);
    } else if (currentDealerTotal > 21) {
      handleGameOver("win", bet * 4); // 2x bet
    } else if (currentDealerTotal > newTotal) {
      handleGameOver("lose", 0);
    } else if (newTotal > currentDealerTotal) {
      handleGameOver("win", bet * 4); // 2x bet
    } else {
      handleGameOver("push", bet * 2); // Zwrot podwójnego zakładu
    }
  };

  // Zakończenie gry i rozliczenie
  const handleGameOver = (result: string, payout: number) => {
    setGameOver(true);
    setGameResult(result);
    setIsPlaying(false);

    if (payout > 0) {
      setBalance((prev) => prev + payout);
      setWinAmount(payout);
    }

    // Dodaj do historii
    setGameHistory((prev) => [
      {
        result,
        amount: result === "lose" ? -bet : result === "push" ? 0 : payout - bet,
      },
      ...prev.slice(0, 9),
    ]);

    let resultMessage = "";

    switch (result) {
      case "blackjack":
        resultMessage = `Blackjack! Wygrałeś ${payout} PLN!`;
        break;
      case "win":
        resultMessage = `Wygrałeś ${payout} PLN!`;
        break;
      case "lose":
        resultMessage = "Przegrałeś!";
        break;
      case "bust":
        resultMessage = "Przegrałeś! Przekroczyłeś 21.";
        break;
      case "push":
        resultMessage = "Remis! Odzyskujesz swój zakład.";
        break;
    }

    toast({
      title: getResultTitle(result),
      description: resultMessage,
      variant:
        result === "lose" || result === "bust" ? "destructive" : "success",
    });
  };

  const getResultTitle = (result: string) => {
    switch (result) {
      case "blackjack":
        return "Blackjack!";
      case "win":
        return "Wygrana!";
      case "lose":
        return "Przegrana";
      case "bust":
        return "Przegrana";
      case "push":
        return "Remis";
      default:
        return "Koniec gry";
    }
  };

  // Zmiana zakładu
  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setBet(value);
    }
  };

  const handleBetAdjust = (amount: number) => {
    setBet((prev) => Math.max(5, prev + amount));
  };

  useEffect(() => {
    // Pobierz saldo przy pierwszym renderowaniu
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/user/balance");
        const data = await response.json();
        setBalance(data.balance || 1000);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="w-full shadow-lg border-0 bg-gradient-to-b from-emerald-900 to-emerald-800">
        <CardHeader className="relative border-b border-emerald-700">
          <CardTitle className="text-2xl text-center text-white">
            Blackjack VIP
          </CardTitle>
          <div className="absolute right-4 top-4 bg-emerald-700 rounded-full px-3 py-1 flex items-center space-x-2">
            <Wallet size={18} className="text-yellow-400" />
            <span className="font-bold text-yellow-400">{balance} PLN</span>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Dealer's Cards */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <Badge
                variant="outline"
                className="bg-emerald-700 text-white border-emerald-600"
              >
                Krupier: {secondCardHidden ? dealerTotal + "+?" : dealerTotal}
              </Badge>
            </div>
            <div className="flex gap-2 mb-8">
              <AnimatePresence>
                {dealerCards.map((card, index) => (
                  <PlayingCard
                    key={`dealer-${index}`}
                    value={card}
                    hidden={index === 1 && secondCardHidden}
                    isDealer={true}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Game Result */}
            <AnimatePresence>
              {gameResult && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-center p-3 rounded-md ${
                    gameResult === "win" || gameResult === "blackjack"
                      ? "bg-green-500 bg-opacity-20 text-green-400"
                      : gameResult === "push"
                      ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                      : "bg-red-500 bg-opacity-20 text-red-400"
                  }`}
                >
                  <p className="text-lg font-bold">
                    {gameResult === "blackjack" && "BLACKJACK!"}
                    {gameResult === "win" && "WYGRANA!"}
                    {gameResult === "lose" && "PRZEGRANA"}
                    {gameResult === "bust" && "PRZEGRANA - PONAD 21!"}
                    {gameResult === "push" && "REMIS"}
                  </p>
                  {(gameResult === "win" || gameResult === "blackjack") && (
                    <p>Wygrałeś {winAmount} PLN</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Player's Cards */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <Badge
                variant="outline"
                className="bg-emerald-700 text-white border-emerald-600"
              >
                Gracz: {playerTotal}
              </Badge>
            </div>
            <div className="flex gap-2 flex-wrap">
              <AnimatePresence>
                {playerCards.map((card, index) => (
                  <PlayingCard key={`player-${index}`} value={card} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Bet Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm text-gray-300 mb-1 block">
                Twój zakład:
              </label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBetAdjust(-5)}
                  disabled={bet <= 5 || isPlaying}
                  className="bg-emerald-700 border-emerald-600 hover:bg-emerald-600 text-white"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="relative mx-2 flex-1">
                  <Input
                    type="number"
                    value={bet}
                    onChange={handleBetChange}
                    min={5}
                    max={balance}
                    disabled={isPlaying}
                    className="pl-8 bg-emerald-700 border-emerald-600 text-white"
                  />
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBetAdjust(5)}
                  disabled={bet >= balance || isPlaying}
                  className="bg-emerald-700 border-emerald-600 hover:bg-emerald-600 text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setBet(Math.floor(balance * 0.1))}
                disabled={isPlaying}
                className="bg-emerald-700 border-emerald-600 hover:bg-emerald-600 text-white"
              >
                10%
              </Button>
              <Button
                variant="outline"
                onClick={() => setBet(Math.floor(balance * 0.25))}
                disabled={isPlaying}
                className="bg-emerald-700 border-emerald-600 hover:bg-emerald-600 text-white"
              >
                25%
              </Button>
              <Button
                variant="outline"
                onClick={() => setBet(Math.floor(balance * 0.5))}
                disabled={isPlaying}
                className="bg-emerald-700 border-emerald-600 hover:bg-emerald-600 text-white"
              >
                50%
              </Button>
              <Button
                variant="outline"
                onClick={() => setBet(balance)}
                disabled={isPlaying}
                className="bg-emerald-700 border-emerald-600 hover:bg-emerald-600 text-white"
              >
                Max
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4 border-t border-emerald-700 p-4">
          <div className="w-full sm:w-auto flex gap-2">
            <Button
              onClick={startGame}
              disabled={isPlaying || balance < bet}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
            >
              {gameOver ? "Nowa gra" : "Rozdaj"}
            </Button>
          </div>

          <div className="w-full sm:w-auto flex gap-2">
            <Button
              onClick={handleHit}
              disabled={!isPlaying || gameOver}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Dobierz
            </Button>
            <Button
              onClick={handleStand}
              disabled={!isPlaying || gameOver}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Pas
            </Button>
            <Button
              onClick={handleDouble}
              disabled={
                !isPlaying ||
                gameOver ||
                playerCards.length !== 2 ||
                balance < bet
              }
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Podwój
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Game History */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-100">
          Historia gier
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {gameHistory.map((game, index) => (
            <Card key={index} className="bg-emerald-800 border-emerald-700">
              <CardContent className="p-4 flex justify-between items-center">
                <Badge
                  variant={
                    game.result === "win" || game.result === "blackjack"
                      ? "success"
                      : game.result === "push"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {game.result === "blackjack"
                    ? "BJ"
                    : game.result === "win"
                    ? "Win"
                    : game.result === "push"
                    ? "Push"
                    : "Lose"}
                </Badge>
                <span
                  className={`font-bold ${
                    game.amount > 0
                      ? "text-green-400"
                      : game.amount < 0
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {game.amount > 0 ? "+" : ""}
                  {game.amount} PLN
                </span>
              </CardContent>
            </Card>
          ))}

          {gameHistory.length === 0 && (
            <div className="col-span-full text-center p-4 text-gray-400 bg-emerald-800/20 rounded-md">
              Brak historii gier
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
