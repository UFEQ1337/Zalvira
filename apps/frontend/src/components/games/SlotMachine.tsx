import React, { useState, useEffect } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { casinoService } from "@/lib/api/casino-service";
import { Wallet, DollarSign, RotateCcw, Play, Save } from "lucide-react";

const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "7️⃣"];

const SlotMachine = () => {
  const { toast } = useToast();
  const [reels, setReels] = useState<string[]>(["?", "?", "?"]);
  const [bet, setBet] = useState<number>(10);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [lastWin, setLastWin] = useState<number>(0);
  const [outcome, setOutcome] = useState<string>("");
  const [lastPayouts, setLastPayouts] = useState<number[]>([]);

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

  // Animacja dla wygranych
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  const handleBetChange = (value: number[]) => {
    setBet(value[0]);
  };

  const handleSpin = async () => {
    if (isSpinning) return;

    if (balance < bet) {
      toast({
        title: "Niewystarczające środki",
        description:
          "Nie masz wystarczających środków, aby zagrać. Doładuj swoje konto.",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    setOutcome("");

    // Animacja losowania
    const animationReels = Array(3)
      .fill(0)
      .map(() => symbols[0]);
    setReels(animationReels);

    let currentReel = 0;
    const animationInterval = setInterval(() => {
      if (currentReel >= 3) {
        clearInterval(animationInterval);
        playGame();
        return;
      }

      setReels((prev) => {
        const newReels = [...prev];
        newReels[currentReel] =
          symbols[Math.floor(Math.random() * symbols.length)];
        return newReels;
      });

      currentReel++;
    }, 300);
  };

  const playGame = async () => {
    try {
      const result = await casinoService.playSlotMachine(bet);

      setBalance((prev) => prev - bet + result.payout);
      setReels(result.reels);
      setOutcome(result.outcome);
      setLastWin(result.payout);

      if (result.payout > 0) {
        setLastPayouts((prev) => [result.payout, ...prev].slice(0, 5));

        toast({
          title: "Wygrana!",
          description: `Wygrałeś ${result.payout} PLN!`,
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error playing slot machine:", error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas gry. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsSpinning(false);
    }
  };

  const handleMaxBet = () => {
    setBet(Math.min(100, balance));
  };

  const handleQuickBet = (amount: number) => {
    setBet(amount);
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <Card className="w-full shadow-lg border-0 bg-gradient-to-b from-purple-900 to-purple-800">
        <CardHeader className="relative border-b border-purple-700">
          <CardTitle className="text-2xl text-center text-white">
            Mega Fortune Slots
          </CardTitle>
          <div className="absolute right-4 top-4 bg-purple-700 rounded-full px-3 py-1 flex items-center space-x-2">
            <Wallet size={18} className="text-yellow-400" />
            <span className="font-bold text-yellow-400">{balance} PLN</span>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="mb-8 relative">
            <div className="bg-black bg-opacity-30 rounded-lg p-8 flex justify-center gap-4">
              {reels.map((symbol, index) => (
                <motion.div
                  key={index}
                  className="w-24 h-24 flex items-center justify-center rounded-lg bg-gradient-to-b from-purple-700 to-purple-600 border-2 border-purple-500 shadow-inner text-4xl"
                  animate={isSpinning ? { y: [0, -10, 0], rotateX: 360 } : {}}
                  transition={
                    isSpinning
                      ? {
                          duration: 0.5,
                          repeat: 2,
                          repeatType: "loop",
                          delay: index * 0.2,
                        }
                      : {}
                  }
                >
                  {symbol}
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {outcome === "win" && lastWin > 0 && (
                <motion.div
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <motion.div
                    className="bg-yellow-500 bg-opacity-90 text-black font-bold text-xl rounded-lg px-6 py-3 shadow-lg"
                    variants={pulseVariants}
                    animate="pulse"
                  >
                    + {lastWin} PLN!
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:w-1/2 space-y-2">
                <label className="text-sm text-gray-300">Twój zakład:</label>
                <div className="relative">
                  <Slider
                    value={[bet]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={handleBetChange}
                    disabled={isSpinning}
                    className="my-4"
                  />
                  <Input
                    type="number"
                    value={bet}
                    onChange={(e) => setBet(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="w-24 bg-purple-700 border-purple-600 text-white"
                    disabled={isSpinning}
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
                      className="bg-purple-700 border-purple-600 hover:bg-purple-600 text-white"
                      onClick={() => handleQuickBet(amount)}
                      disabled={isSpinning || amount > balance}
                    >
                      {amount}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-700 border-purple-600 hover:bg-purple-600 text-white"
                    onClick={handleMaxBet}
                    disabled={isSpinning || balance <= 0}
                  >
                    MAX
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-purple-700 p-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-700">
              RTP: 96.5%
            </Badge>
            <Badge variant="secondary" className="bg-purple-700">
              Stawka min: 1 PLN
            </Badge>
            <Badge variant="secondary" className="bg-purple-700">
              Stawka max: 100 PLN
            </Badge>
          </div>

          <div className="space-x-2">
            <Button
              variant="outline"
              className="bg-purple-700 border-purple-600 hover:bg-purple-600 text-white"
              disabled={isSpinning}
            >
              <RotateCcw size={20} className="mr-2" />
              Oczyść
            </Button>
            <Button
              onClick={handleSpin}
              disabled={isSpinning || balance < bet}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8"
            >
              {isSpinning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RotateCcw size={20} className="mr-2" />
                </motion.div>
              ) : (
                <Play size={20} className="mr-2" />
              )}
              {isSpinning ? "Kręcenie..." : "ZAKRĘĆ!"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-6 w-full">
        <h3 className="text-xl font-semibold mb-4 text-gray-100">
          Ostatnie wygrane
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {lastPayouts.length > 0 ? (
            lastPayouts.map((payout, index) => (
              <Card key={index} className="bg-purple-800 border-purple-700">
                <CardContent className="p-4 flex justify-between items-center">
                  <span className="text-gray-300">#{index + 1}</span>
                  <span className="font-bold text-yellow-400">
                    {payout} PLN
                  </span>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center py-4">
              Brak historii wygranych
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;
