import { useState } from "react";
import { Calendar, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [birthDate, setBirthDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gender, setGender] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    birthDate: string;
    zodiac: string;
    kuaNumber: number;
  } | null>(null);

  const calculateZodiac = (birthYear: number) => {
    const animals = [
      "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
      "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
    ];
    const baseYear = 2020;
    let index = (birthYear - baseYear) % 12;
    if (index < 0) index += 12;
    return animals[index];
  };

  const calculateKuaNumber = (birthYear: number, gender: string, bornBeforeChineseNewYear = false) => {
    if (bornBeforeChineseNewYear) birthYear -= 1;
    const sumDigits = (year: number) => year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    let sum = sumDigits(birthYear);
    while (sum >= 10) sum = sumDigits(sum);
    let kua;
    const isAfter2000 = birthYear >= 2000;
    if (gender.toLowerCase() === "male") {
      kua = (isAfter2000 ? 9 : 10) - sum;
      if (kua === 5) kua = 2;
    } else if (gender.toLowerCase() === "female") {
      kua = (isAfter2000 ? 6 : 5) + sum;
      while (kua >= 10) kua = sumDigits(kua);
      if (kua === 5) kua = 8;
    } else {
      throw new Error("Invalid gender");
    }
    return kua;
  };

  const handleCalculate = () => {
    if (!birthDate) return;
    setIsModalOpen(true);
    setShowResults(false);
    setGender("");
  };

  const handleProceed = () => {
    if (!gender || !birthDate) return;
    
    const date = new Date(birthDate);
    const birthYear = date.getFullYear();
    
    const zodiac = calculateZodiac(birthYear);
    const kuaNumber = calculateKuaNumber(birthYear, gender);
    
    setResults({
      birthDate,
      zodiac,
      kuaNumber
    });
    setShowResults(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowResults(false);
    setGender("");
  };

  return (
    <div className="min-h-screen feng-shui-bg">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-playfair font-bold text-prosperity">
            My Feng Shui Calculator
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-6xl font-playfair font-bold text-foreground mb-6">
              Discover Your Feng Shui
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Calculate your personal feng shui elements, find harmony in your space, and unlock the secrets of ancient Chinese wisdom
            </p>
          </div>

          {/* Input Section */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto items-end">
            <div className="flex-1 relative">
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="Enter your birthdate to start"
                className="h-14 text-lg pl-4 pr-12 bg-card border-2 border-border focus:border-accent transition-colors"
              />
              <CalendarIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            </div>
            <Button
              onClick={handleCalculate}
              disabled={!birthDate}
              className="gold-button h-14 px-8 text-lg font-semibold whitespace-nowrap"
            >
              Calculate Now
            </Button>
          </div>
        </div>
      </main>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="modal-content fade-in max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-playfair text-foreground">
              {showResults ? "Your Feng Shui Profile" : "What is your gender?"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            {!showResults ? (
              <>
                <RadioGroup value={gender} onValueChange={setGender} className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="text-lg cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="text-lg cursor-pointer">Female</Label>
                  </div>
                </RadioGroup>
                
                <Button
                  onClick={handleProceed}
                  disabled={!gender}
                  className="w-full gold-button h-12 text-lg font-semibold"
                >
                  Proceed
                </Button>
              </>
            ) : (
              <div className="space-y-6 text-center">
                <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">Birth Date</h3>
                    <p className="text-muted-foreground">{new Date(results!.birthDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">Chinese Zodiac</h3>
                    <p className="text-2xl font-playfair font-bold text-prosperity">{results!.zodiac}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">Kua Number</h3>
                    <p className="text-3xl font-playfair font-bold text-accent">{results!.kuaNumber}</p>
                  </div>
                </div>
                
                <Button
                  onClick={closeModal}
                  className="w-full gold-button h-12 text-lg font-semibold"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
