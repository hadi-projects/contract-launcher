import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Image, Shield, Percent } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ContractTemplatesProps {
  onSelectTemplate: () => void;
}

export default function ContractTemplates({ onSelectTemplate }: ContractTemplatesProps) {
  const { toast } = useToast();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const getTemplateIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "token":
        return <Coins className="text-yellow-500 text-xl" />;
      case "nft":
        return <Image className="text-purple-500 text-xl" />;
      case "multisig":
        return <Shield className="text-green-500 text-xl" />;
      case "defi":
        return <Percent className="text-indigo-500 text-xl" />;
      default:
        return <Coins className="text-gray-500 text-xl" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "standard":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectTemplate = (template: any) => {
    // In a real app, this would populate the deploy form with template data
    toast({
      title: "Template Selected",
      description: `${template.name} template loaded for deployment`,
    });
    onSelectTemplate();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading templates...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contract Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template: any) => (
              <Card key={template.id} className="border border-gray-200 hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    </div>
                    <div className="ml-4">
                      {getTemplateIcon(template.category)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Badge className={getDifficultyColor(template.difficulty)}>
                        {template.difficulty}
                      </Badge>
                      {template.isAudited && (
                        <Badge className="bg-green-100 text-green-800">
                          Audited
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectTemplate(template)}
                      className="text-primary hover:text-primary"
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Fallback templates if none loaded */}
            {templates.length === 0 && (
              <>
                <Card className="border border-gray-200 hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">ERC-20 Token</h3>
                        <p className="text-sm text-gray-600 mt-1">Standard fungible token implementation</p>
                      </div>
                      <Coins className="text-yellow-500 text-xl" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Badge className="bg-blue-100 text-blue-800">Standard</Badge>
                        <Badge className="bg-green-100 text-green-800">Audited</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectTemplate({ name: "ERC-20 Token" })}
                        className="text-primary hover:text-primary"
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">ERC-721 NFT</h3>
                        <p className="text-sm text-gray-600 mt-1">Non-fungible token standard</p>
                      </div>
                      <Image className="text-purple-500 text-xl" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Badge className="bg-blue-100 text-blue-800">Standard</Badge>
                        <Badge className="bg-green-100 text-green-800">Audited</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectTemplate({ name: "ERC-721 NFT" })}
                        className="text-primary hover:text-primary"
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">MultiSig Wallet</h3>
                        <p className="text-sm text-gray-600 mt-1">Multi-signature wallet contract</p>
                      </div>
                      <Shield className="text-green-500 text-xl" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Badge className="bg-orange-100 text-orange-800">Advanced</Badge>
                        <Badge className="bg-green-100 text-green-800">Audited</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectTemplate({ name: "MultiSig Wallet" })}
                        className="text-primary hover:text-primary"
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Staking Contract</h3>
                        <p className="text-sm text-gray-600 mt-1">Token staking and rewards</p>
                      </div>
                      <Percent className="text-indigo-500 text-xl" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Badge className="bg-orange-100 text-orange-800">Advanced</Badge>
                        <Badge className="bg-yellow-100 text-yellow-800">Beta</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectTemplate({ name: "Staking Contract" })}
                        className="text-primary hover:text-primary"
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
