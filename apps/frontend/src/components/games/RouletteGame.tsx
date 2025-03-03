import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { casinoService } from "@/lib/api/casino-service";
import { Wallet, DollarSign, RotateCcw, Play } from "lucide-react";

const ROULETTE_NUMBERS = Array.from({ length: 37 }, (_, i) => i); // 0-36

const numberToColor = (number: number) => {
  if (number === 0) return "green";
  return number % 2 === 0 ? "black" : "red";
};

const RouletteWheel = ({
  spinning,
  winningNumber,
}: {
  spinning: boolean;
  winningNumber: number;
}) => {
  return (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <motion.div
        className="w-full h-full rounded-full border-4 border-gold-500 overflow-hidden shadow-lg"
        animate={spinning ? { rotate: 360 * 10 + winningNumber * 10 } : {}}
        transition={spinning ? { duration: 5, ease: "easeOut" } : {}}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-green-700 to-green-800 flex items-center justify-center relative">
          <div className="absolute inset-0 w-full h-full">
            {ROULETTE_NUMBERS.map((num, i) => (
              <div
                key={num}
                className="absolute font-bold text-white text-xs"
                style={{
                  top: "50%",
                  left: "50%",
                  width: "100%",
                  height: "100%",
                  transform: `rotate(${
                    i * (360 / ROULETTE_NUMBERS.length)
                  }deg)`,
                }}
              >
                <div
                  className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center ${
                    num === 0
                      ? "bg-green-500"
                      : num % 2 === 0
                      ? "bg-black"
                      : "bg-red-600"
                  }`}
                >
                  {num}
                </div>
              </div>
            ))}
          </div>
          <div className="w-20 h-20 rounded-full bg-white bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gold-400">
              <span className="text-2xl font-bold text-white">
                {spinning ? "?" : winningNumber}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="absolute top-0 right-0 w-4 h-12 bg-gold-500 rounded-full transform translate-x-1/2"></div>
    </div>
  );
};

const RouletteGame = () => {
  const { toast } = useToast();
  const [bet, setBet] = useState(10);
  const [chosenNumber, setChosenNumber] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState(0);
  const [balance, setBalance] = useState(1000);
  const [betType, setBetType] = useState<"single" | "color" | "range">(
    "single"
  );
  const [chosenColor, setChosenColor] = useState<"red" | "black" | null>(null);
  const [chosenRange, setChosenRange] = useState<"low" | "high" | null>(null);
  const [lastResults, setLastResults] = useState<number[]>([]);

  // Pobierz saldo przy montowaniu komponentu
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/user/balance");
        const data = await response.json();
        setBalance(data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, []);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBet(Number(e.target.value));
  };

  const handleSpin = async () => {
    if (spinning) return;

    let actualChosenNumber = chosenNumber;

    // Konwersja wyboru koloru lub zakresu na numeryczny odpowiednik
    if (betType === "color") {
      if (!chosenColor) {
        toast({
          title: "Brak wyboru",
          description: "Wybierz kolor na który chcesz postawić.",
          variant: "destructive",
        });
        return;
      }

      // API wymaga numerycznego wyboru, więc wybieramy reprezentatywną liczbę
      actualChosenNumber = chosenColor === "red" ? 1 : 2;
    } else if (betType === "range") {
      if (!chosenRange) {
        toast({
          title: "Brak wyboru",
          description: "Wybierz zakres na który chcesz postawić.",
          variant: "destructive",
        });
        return;
      }

      // API wymaga numerycznego wyboru, więc wybieramy reprezentatywną liczbę
      actualChosenNumber = chosenRange === "low" ? 10 : 25;
    } else if (betType === "single" && chosenNumber === null) {
      toast({
        title: "Brak wyboru",
        description: "Wybierz numer na który chcesz postawić.",
        variant: "destructive",
      });
      return;
    }

    if (balance < bet) {
      toast({
        title: "Niewystarczające środki",
        description:
          "Nie masz wystarczających środków, aby zagrać. Doładuj swoje konto.",
        variant: "destructive",
      });
      return;
    }

    setSpinning(true);

    try {
      // W rzeczywistej implementacji używałbyś API
      const response = await casinoService.playRoulette(
        bet,
        actualChosenNumber!
      );

      // Symulujemy opóźnienie animacji
      setTimeout(() => {
        setWinningNumber(response.winningNumber);

        // Zaktualizuj saldo i historię
        setBalance((prev) => prev - bet + response.payout);
        setLastResults((prev) =>
          [response.winningNumber, ...prev].slice(0, 10)
        );

        let isWin = false;

        // Sprawdź czy wygraliśmy
        if (betType === "single") {
          isWin = chosenNumber === response.winningNumber;
        } else if (betType === "color") {
          const resultColor = numberToColor(response.winningNumber);
          isWin =
            (chosenColor === "red" && resultColor === "red") ||
            (chosenColor === "black" && resultColor === "black");
        } else if (betType === "range") {
          isWin =
            (chosenRange === "low" &&
              response.winningNumber >= 1 &&
              response.winningNumber <= 18) ||
            (chosenRange === "high" &&
              response.winningNumber >= 19 &&
              response.winningNumber <= 36);
        }

        if (isWin) {
          toast({
            title: "Wygrana!",
            description: `Wygrałeś ${response.payout} PLN!`,
            variant: "success",
          });
        }

        setSpinning(false);
      }, 5000);
    } catch (error) {
      console.error("Error playing roulette:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas gry. Spróbuj ponownie.",
        variant: "destructive",
      });
      setSpinning(false);
    }
  };

  const handleNumberClick = (num: number) => {
    if (spinning) return;
    setChosenNumber(num);
  };

  const handleQuickBet = (amount: number) => {
    setBet(amount);
  };

  const renderNumberGrid = () => {
    return (
      <div className="grid grid-cols-6 gap-2 max-w-lg mx-auto mt-4">
        <div
          className={`col-span-2 rounded p-3 bg-green-600 text-white font-bold text-center cursor-pointer ${
            chosenNumber === 0 ? "ring-2 ring-yellow-400" : ""
          }`}
          onClick={() => handleNumberClick(0)}
        >
          0
        </div>

        {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => (
          <div
            key={num}
            className={`rounded p-2 ${
              num % 2 === 0 ? "bg-black" : "bg-red-600"
            } text-white font-bold text-center cursor-pointer ${
              chosenNumber === num ? "ring-2 ring-yellow-400" : ""
            }`}
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </div>
        ))}
      </div>
    );
  };

  const renderColorBetting = () => {
    return (
      <div className="flex justify-center gap-4 mt-6">
        <Button
          className={`bg-red-600 hover:bg-red-700 text-white w-32 h-16 text-xl ${
            chosenColor === "red" ? "ring-2 ring-yellow-400" : ""
          }`}
          onClick={() => setChosenColor("red")}
          disabled={spinning}
        >
          CZERWONE
        </Button>
        <Button
          className={`bg-black hover:bg-gray-900 text-white w-32 h-16 text-xl ${
            chosenColor === "black" ? "ring-2 ring-yellow-400" : ""
          }`}
          onClick={() => setChosenColor("black")}
          disabled={spinning}
        >
          CZARNE
        </Button>
      </div>
    );
  };

  const renderRangeBetting = () => {
    return (
      <div className="flex justify-center gap-4 mt-6">
        <Button
          className={`bg-blue-600 hover:bg-blue-700 text-white w-32 h-16 text-xl ${
            chosenRange === "low" ? "ring-2 ring-yellow-400" : ""
          }`}
          onClick={() => setChosenRange("low")}
          disabled={spinning}
        >
          1-18
        </Button>
        <Button
          className={`bg-purple-600 hover:bg-purple-700 text-white w-32 h-16 text-xl ${
            chosenRange === "high" ? "ring-2 ring-yellow-400" : ""
          }`}
          onClick={() => setChosenRange("high")}
          disabled={spinning}
        >
          19-36
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="w-full shadow-lg border-0 bg-gradient-to-b from-green-900 to-green-800">
        <CardHeader className="relative border-b border-green-700">
          <CardTitle className="text-2xl text-center text-white">
            Ruletka Królewska
          </CardTitle>
          <div className="absolute right-4 top-4 bg-green-700 rounded-full px-3 py-1 flex items-center space-x-2">
            <Wallet size={18} className="text-yellow-400" />
            <span className="font-bold text-yellow-400">{balance} PLN</span>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <RouletteWheel spinning={spinning} winningNumber={winningNumber} />

          <Tabs
            defaultValue="single"
            className="w-full"
            value={betType}
            onValueChange={(value) => setBetType(value as any)}
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="single">Pojedyncze numery</TabsTrigger>
              <TabsTrigger value="color">Kolory</TabsTrigger>
              <TabsTrigger value="range">Zakresy</TabsTrigger>
            </TabsList>

            <TabsContent
              value="single"
              className="border rounded-md p-4 border-green-700 bg-green-800 bg-opacity-30"
            >
              {renderNumberGrid()}
              <div className="text-center mt-4 text-gray-300">
                <p>Wygrana 35:1</p>
              </div>
            </TabsContent>

            <TabsContent
              value="color"
              className="border rounded-md p-4 border-green-700 bg-green-800 bg-opacity-30"
            >
              {renderColorBetting()}
              <div className="text-center mt-4 text-gray-300">
                <p>Wygrana 1:1</p>
              </div>
            </TabsContent>

            <TabsContent
              value="range"
              className="border rounded-md p-4 border-green-700 bg-green-800 bg-opacity-30"
            >
              {renderRangeBetting()}
              <div className="text-center mt-4 text-gray-300">
                <p>Wygrana 1:1</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:w-1/2 space-y-2">
                <label className="text-sm text-gray-300">Twój zakład:</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={bet}
                    onChange={handleBetChange}
                    min={1}
                    max={1000}
                    className="w-full bg-green-700 border-green-600 text-white"
                    disabled={spinning}
                  />
                  <DollarSign className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="w-full sm:w-1/2">
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {[5, 10, 25, 50, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      className="bg-green-700 border-green-600 hover:bg-green-600 text-white"
                      onClick={() => handleQuickBet(amount)}
                      disabled={spinning || amount > balance}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-green-700 p-4">
          <div className="flex flex-wrap gap-2">
            {lastResults.map((result, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`${
                  result === 0
                    ? "bg-green-500 border-green-400"
                    : result % 2 === 0
                    ? "bg-black border-gray-700"
                    : "bg-red-600 border-red-500"
                } text-white`}
              >
                {result}
              </Badge>
            ))}
          </div>

          <Button
            onClick={handleSpin}
            disabled={spinning || balance < bet}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8"
          >
            {spinning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RotateCcw size={20} className="mr-2" />
              </motion.div>
            ) : (
              <Play size={20} className="mr-2" />
            )}
            {spinning ? "Kręcenie..." : "ZAKRĘĆ!"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RouletteGame;
