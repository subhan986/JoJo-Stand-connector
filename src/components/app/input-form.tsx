'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, File, Link, Loader2, Text } from 'lucide-react';
import type { AnalyzeJoJoConnectionInput } from '@/ai/flows/analyze-jojo-connection';

interface InputFormProps {
  onSubmit: (data: AnalyzeJoJoConnectionInput) => void;
  isLoading: boolean;
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit
            setFileError("File is too large. Maximum size is 4MB.");
            setFile(null);
            return;
        }
        setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let input: AnalyzeJoJoConnectionInput;

    try {
        switch (activeTab) {
        case 'url':
            if (!url) return;
            input = { type: 'url', url };
            break;
        case 'file':
            if (!file) return;
            const fileBase64 = await toBase64(file);
            input = { type: 'file', file: fileBase64 };
            break;
        case 'text':
        default:
            if (!text) return;
            input = { type: 'text', text };
            break;
        }
        onSubmit(input);
    } catch (error) {
        setFileError("Failed to read file. Please try again.");
        console.error("File processing error:", error);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle>Awaken Your Stand</CardTitle>
        <CardDescription>Present any concept, and I shall reveal its connection to the Joestar lineage.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text"><Text className="w-4 h-4 mr-2"/>Text</TabsTrigger>
            <TabsTrigger value="url"><Link className="w-4 h-4 mr-2"/>URL</TabsTrigger>
            <TabsTrigger value="file"><File className="w-4 h-4 mr-2"/>File</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit} className="mt-4">
            <TabsContent value="text">
                <Textarea
                    placeholder="e.g., 'The Mona Lisa', 'Your next line is...', 'A turtle with a key'"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={5}
                    disabled={isLoading}
                    className="font-code"
                />
            </TabsContent>
            <TabsContent value="url">
                <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                    className="font-code"
                />
            </TabsContent>
            <TabsContent value="file">
                <Label htmlFor="file-upload" className="sr-only">Upload File</Label>
                <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.txt,.docx,.png, .jpeg, .jpg, .gif"
                    onChange={handleFileChange}
                    disabled={isLoading}
                />
            </TabsContent>

            {fileError && (
              <div className="mt-2 text-sm text-destructive flex items-center">
                <AlertCircle className="w-4 h-4 mr-2"/> {fileError}
              </div>
            )}

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Experience Golden Wind'
              )}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
