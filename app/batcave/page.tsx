"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BatcavePage() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsAuth(authService.isAuthenticated());
  }, []);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await authService.login(username, password);
      setIsAuth(true);
      router.push("/batcave/projects");
    } catch {
      setError("Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  if (isAuth === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  if (!isAuth) {
    return (
      
        <Card className=" max-w-md w-full">
          <CardHeader className="flex items-center justify-center">
            <CardTitle className="text-3xl font-bold text-center">BATCAVE</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="username">Identifiant</Label>
                <Input
                  id="username"
                  placeholder="votre identifiant"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="username"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleLogin}
              disabled={loading || !username || !password}
              className="w-full"
            >
              {loading ? "···" : "Connexion"}
            </Button>
          </CardFooter>
        </Card>
    
    );
  }

  router.push("/batcave/projects");
  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Redirection…</p>
    </div>
  );
}