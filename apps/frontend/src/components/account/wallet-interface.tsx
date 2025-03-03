import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import {
  ChevronRight,
  TrendingUp,
  CreditCard,
  Wallet,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { walletService } from "@/lib/api/wallet-service";
import { siteConfig } from "@/config/site";

const WalletInterface = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("balance");
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [currency] = useState("PLN");
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);

  // Form states
  const [depositAmount, setDepositAmount] = useState(100);
  const [depositMethod, setDepositMethod] = useState("card");
  const [withdrawAmount, setWithdrawAmount] = useState(100);
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [transferAmount, setTransferAmount] = useState(50);
  const [transferRecipient, setTransferRecipient] = useState("");

  // Loading states
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  // Fetch wallet data
  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      // W rzeczywistym projekcie, te dane pochodziłyby z API
      const userResponse = await fetch("/api/user/profile");
      const userData = await userResponse.json();
      setBalance(userData.balance);

      // Pobierz transakcje z serwisu
      const transactionsResponse = await walletService.getTransactions();
      setAllTransactions(transactionsResponse);

      // Filtruj oczekujące transakcje
      const pending = transactionsResponse.filter(
        (transaction) => transaction.status === "pending"
      );
      setPendingTransactions(pending);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast({
        title: "Błąd pobierania danych",
        description:
          "Nie udało się pobrać danych portfela. Spróbuj ponownie później.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setIsDepositing(true);

    try {
      const response = await walletService.deposit(depositAmount);

      // Aktualizuj stan po udanej wpłacie
      setBalance(response.newBalance);

      toast({
        title: "Wpłata zrealizowana",
        description: `Pomyślnie wpłacono ${depositAmount} ${currency} na Twoje konto.`,
        variant: "success",
      });

      // Odśwież dane portfela
      fetchWalletData();

      // Resetuj formularz
      setDepositAmount(100);
    } catch (error) {
      console.error("Deposit error:", error);
      toast({
        title: "Błąd wpłaty",
        description:
          "Nie udało się zrealizować wpłaty. Spróbuj ponownie później.",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setIsWithdrawing(true);

    try {
      if (withdrawAmount > balance) {
        throw new Error("Niewystarczające środki");
      }

      const response = await walletService.withdraw(withdrawAmount);

      // Aktualizuj stan po udanej wypłacie
      setBalance(response.newBalance);

      toast({
        title: "Wypłata zrealizowana",
        description: `Pomyślnie zlecono wypłatę ${withdrawAmount} ${currency} z Twojego konta.`,
        variant: "success",
      });

      // Odśwież dane portfela
      fetchWalletData();

      // Resetuj formularz
      setWithdrawAmount(100);
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast({
        title: "Błąd wypłaty",
        description:
          error.message === "Niewystarczające środki"
            ? "Nie masz wystarczających środków, aby wykonać tę operację."
            : "Nie udało się zrealizować wypłaty. Spróbuj ponownie później.",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setIsTransferring(true);

    try {
      if (transferAmount > balance) {
        throw new Error("Niewystarczające środki");
      }

      if (!transferRecipient) {
        throw new Error("Brak odbiorcy");
      }

      // Sprawdź, czy to email czy nazwa użytkownika
      const isEmail = transferRecipient.includes("@");

      const response = await walletService.transfer({
        amount: transferAmount,
        [isEmail ? "recipientEmail" : "recipientUsername"]: transferRecipient,
      });

      // Aktualizuj stan po udanym przelewie
      setBalance(response.senderNewBalance);

      toast({
        title: "Przelew zrealizowany",
        description: `Pomyślnie przelano ${transferAmount} ${currency} do użytkownika ${transferRecipient}.`,
        variant: "success",
      });

      // Odśwież dane portfela
      fetchWalletData();

      // Resetuj formularz
      setTransferAmount(50);
      setTransferRecipient("");
    } catch (error) {
      console.error("Transfer error:", error);

      let errorMessage =
        "Nie udało się zrealizować przelewu. Spróbuj ponownie później.";

      if (error.message === "Niewystarczające środki") {
        errorMessage =
          "Nie masz wystarczających środków, aby wykonać tę operację.";
      } else if (error.message === "Brak odbiorcy") {
        errorMessage = "Podaj adres email lub nazwę użytkownika odbiorcy.";
      } else if (error.status === 404) {
        errorMessage =
          "Nie znaleziono użytkownika o podanym adresie email lub nazwie.";
      }

      toast({
        title: "Błąd przelewu",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case "transfer-in":
        return <ArrowDownLeft className="h-4 w-4 text-blue-500" />;
      case "transfer-out":
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case "deposit":
        return "Wpłata";
      case "withdrawal":
        return "Wypłata";
      case "transfer-in":
        return "Otrzymany przelew";
      case "transfer-out":
        return "Wysłany przelew";
      default:
        return type;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-900/20 text-green-500 border-green-500"
          >
            <CheckCircle className="h-3 w-3" /> Zrealizowana
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-yellow-900/20 text-yellow-500 border-yellow-500"
          >
            <Clock className="h-3 w-3" /> Oczekująca
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-red-900/20 text-red-500 border-red-500"
          >
            <XCircle className="h-3 w-3" /> Odrzucona
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderDepositForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Wpłata środków</CardTitle>
        <CardDescription>
          Wybierz metodę płatności i kwotę wpłaty
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDeposit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="depositAmount">Kwota wpłaty</Label>
              <div className="relative">
                <Input
                  id="depositAmount"
                  type="number"
                  min={siteConfig.depositLimits.min}
                  max={siteConfig.depositLimits.max}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  disabled={isDepositing}
                  className="pl-8"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 font-medium">
                  {currency}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Minimalna kwota: {formatCurrency(siteConfig.depositLimits.min)},
                Maksymalna kwota: {formatCurrency(siteConfig.depositLimits.max)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="depositMethod">Metoda płatności</Label>
              <Select
                value={depositMethod}
                onValueChange={setDepositMethod}
                disabled={isDepositing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz metodę płatności" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Karta płatnicza</SelectItem>
                  <SelectItem value="bank">Przelew bankowy</SelectItem>
                  <SelectItem value="blik">BLIK</SelectItem>
                  <SelectItem value="skrill">Skrill</SelectItem>
                  <SelectItem value="neteller">Neteller</SelectItem>
                  <SelectItem value="bitcoin">Bitcoin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 200, 500].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  className={
                    depositAmount === amount ? "bg-primary-500/20" : ""
                  }
                  onClick={() => setDepositAmount(amount)}
                  disabled={isDepositing}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isDepositing ||
              depositAmount < siteConfig.depositLimits.min ||
              depositAmount > siteConfig.depositLimits.max
            }
          >
            {isDepositing && (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isDepositing ? "Przetwarzanie..." : "Wpłać środki"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderWithdrawForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Wypłata środków</CardTitle>
        <CardDescription>Wybierz metodę i kwotę wypłaty</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-6 p-3 bg-primary-500/10 rounded-lg">
          <p className="text-sm">
            Dostępne środki:{" "}
            <span className="font-bold text-primary-500">
              {formatCurrency(balance)}
            </span>
          </p>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdrawAmount">Kwota wypłaty</Label>
              <div className="relative">
                <Input
                  id="withdrawAmount"
                  type="number"
                  min={siteConfig.withdrawalLimits.min}
                  max={Math.min(balance, siteConfig.withdrawalLimits.max)}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  disabled={isWithdrawing}
                  className="pl-8"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 font-medium">
                  {currency}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Minimalna kwota:{" "}
                {formatCurrency(siteConfig.withdrawalLimits.min)}, Maksymalna
                kwota: {formatCurrency(siteConfig.withdrawalLimits.max)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="withdrawMethod">Metoda wypłaty</Label>
              <Select
                value={withdrawMethod}
                onValueChange={setWithdrawMethod}
                disabled={isWithdrawing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz metodę wypłaty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Przelew bankowy</SelectItem>
                  <SelectItem value="card">Karta płatnicza</SelectItem>
                  <SelectItem value="skrill">Skrill</SelectItem>
                  <SelectItem value="neteller">Neteller</SelectItem>
                  <SelectItem value="bitcoin">Bitcoin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[50, 100, 200, Math.min(500, balance)].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  className={
                    withdrawAmount === amount ? "bg-primary-500/20" : ""
                  }
                  onClick={() => setWithdrawAmount(amount)}
                  disabled={isWithdrawing || amount > balance}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isWithdrawing ||
              withdrawAmount > balance ||
              withdrawAmount < siteConfig.withdrawalLimits.min ||
              withdrawAmount > siteConfig.withdrawalLimits.max
            }
          >
            {isWithdrawing && (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isWithdrawing ? "Przetwarzanie..." : "Wypłać środki"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderTransferForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Przelew do innego gracza</CardTitle>
        <CardDescription>
          Prześlij środki bezpośrednio do innego gracza
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-6 p-3 bg-primary-500/10 rounded-lg">
          <p className="text-sm">
            Dostępne środki:{" "}
            <span className="font-bold text-primary-500">
              {formatCurrency(balance)}
            </span>
          </p>
        </div>

        <form onSubmit={handleTransfer} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transferRecipient">
                Odbiorca (email lub nazwa użytkownika)
              </Label>
              <Input
                id="transferRecipient"
                value={transferRecipient}
                onChange={(e) => setTransferRecipient(e.target.value)}
                disabled={isTransferring}
                placeholder="przyklad@email.com lub nazwa_użytkownika"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transferAmount">Kwota przelewu</Label>
              <div className="relative">
                <Input
                  id="transferAmount"
                  type="number"
                  min={1}
                  max={balance}
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  disabled={isTransferring}
                  className="pl-8"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 font-medium">
                  {currency}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  className={
                    transferAmount === amount ? "bg-primary-500/20" : ""
                  }
                  onClick={() => setTransferAmount(amount)}
                  disabled={isTransferring || amount > balance}
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isTransferring ||
              transferAmount > balance ||
              transferAmount <= 0 ||
              !transferRecipient
            }
          >
            {isTransferring ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isTransferring ? "Przetwarzanie..." : "Wyślij przelew"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Portfel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Zarządzaj swoimi środkami, wpłacaj i wypłacaj
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="self-start flex items-center gap-1"
          onClick={fetchWalletData}
          disabled={isLoading}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Odśwież
        </Button>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="balance">Saldo</TabsTrigger>
          <TabsTrigger value="deposit">Wpłata</TabsTrigger>
          <TabsTrigger value="withdraw">Wypłata</TabsTrigger>
          <TabsTrigger value="transfer">Przelew</TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Dostępne środki</CardTitle>
                <CardDescription>Aktualne saldo Twojego konta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold tracking-tight">
                    {isLoading ? (
                      <Skeleton className="h-8 w-32 bg-gray-200 dark:bg-gray-700" />
                    ) : (
                      <span>{formatCurrency(balance)}</span>
                    )}
                  </div>
                  <TrendingUp className="h-8 w-8 text-secondary-500" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("deposit")}
                >
                  Wpłać więcej
                </Button>
                <Button size="sm" onClick={() => setActiveTab("withdraw")}>
                  Wypłać
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Oczekujące transakcje</CardTitle>
                <CardDescription>Trwające wpłaty i wypłaty</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array(2)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton
                          key={i}
                          className="h-10 bg-gray-200 dark:bg-gray-700"
                        />
                      ))}
                  </div>
                ) : pendingTransactions.length > 0 ? (
                  <ul className="space-y-2">
                    {pendingTransactions.slice(0, 3).map((transaction) => (
                      <li
                        key={transaction.id}
                        className="flex justify-between items-center p-2 rounded bg-surface-light dark:bg-surface-dark"
                      >
                        <div className="flex items-center gap-2">
                          {transaction.type === "deposit" ? (
                            <CreditCard className="h-4 w-4 text-green-500" />
                          ) : (
                            <Wallet className="h-4 w-4 text-amber-500" />
                          )}
                          <span className="text-sm">
                            {getTransactionLabel(transaction.type)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {formatCurrency(transaction.amount)}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                            W trakcie
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Brak oczekujących transakcji
                    </p>
                  </div>
                )}
              </CardContent>
              {pendingTransactions.length > 0 && (
                <CardFooter className="pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto flex items-center gap-1"
                  >
                    Wszystkie transakcje <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Historia transakcji</CardTitle>
              <CardDescription>
                Ostatnie operacje na Twoim koncie
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-12 w-full bg-gray-200 dark:bg-gray-700"
                      />
                    ))}
                </div>
              ) : allTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Rodzaj</TableHead>
                      <TableHead>Kwota</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTransactions.slice(0, 10).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>
                              {new Date(
                                transaction.createdAt
                              ).toLocaleDateString("pl-PL")}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDistance(
                                new Date(transaction.createdAt),
                                new Date(),
                                {
                                  addSuffix: true,
                                  locale: pl,
                                }
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTransactionIcon(transaction.type)}
                            <span>{getTransactionLabel(transaction.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell
                          className={`font-medium ${
                            transaction.type === "deposit" ||
                            transaction.type === "transfer-in"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {(transaction.type === "deposit" ||
                          transaction.type === "transfer-in"
                            ? "+"
                            : "-") + formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status || "completed")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Brak historii transakcji
                  </p>
                </div>
              )}
            </CardContent>
            {allTransactions.length > 10 && (
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Pokaż więcej
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="deposit">{renderDepositForm()}</TabsContent>

        <TabsContent value="withdraw">{renderWithdrawForm()}</TabsContent>

        <TabsContent value="transfer">{renderTransferForm()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletInterface;
