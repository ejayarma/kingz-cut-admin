import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PaymentsPage() {
    return (
        <div className="max-w-4xl mx-auto p-6 rounded-xl border border-gray-200">
            <div className="space-y-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <Label className="mb-2" htmlFor="currency">Currency</Label>
                                <Select defaultValue="GHS">
                                    <SelectTrigger id="currency">
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GHS">Ghana Cedis</SelectItem>
                                        <SelectItem value="USD">US Dollars</SelectItem>
                                        <SelectItem value="EUR">Euros</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="mb-2" htmlFor="symbol">Symbol</Label>
                                <Input id="symbol" defaultValue="GHS" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <h4 className="text-lg font-semibold">Online payment</h4>
                            <p className="text-sm text-muted-foreground">Start accepting online payment once the setting is enabled.</p>
                        </div>
                        <Switch />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <h4 className="text-lg font-semibold mb-4">Select payment methods</h4>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="credit-card" />
                                <Label htmlFor="credit-card">Credit Card</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="bank-transfer" />
                                <Label htmlFor="bank-transfer">Bank Transfer</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="mobile-money" />
                                <Label htmlFor="mobile-money">Mobile Money</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}
