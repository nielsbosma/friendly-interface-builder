import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { FlashingValueDisplay } from "@/components/ui/flashing-value-display";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, RotateCcw, Sparkles, CalendarIcon, Clock, X, CheckIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"

const customers = [
  { value: "customer1", label: "Customer 1" },
  { value: "customer2", label: "Customer 2" },
  { value: "customer3", label: "Customer 3" },
  // Add more customers as needed
];

const products = [
  { sku: "SKU-4577-736", name: "Sneakers" },
  { sku: "SKU-1234-567", name: "T-Shirt" },
  { sku: "SKU-8901-234", name: "Jeans" },
  { sku: "SKU-5678-901", name: "Jacket" },
  // Add more products as needed
];

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const typeOptions = [
  { value: "airmee", label: "AIRMEE" },
  { value: "default", label: "DEFAULT" },
  { value: "klarna", label: "KLARNA" },
];

const Index = () => {
  const [headwaiId, setHeadwaiId] = useState("");
  const [isHeadwaiIdSet, setIsHeadwaiIdSet] = useState(false);
  const [customer, setCustomer] = useState("");
  const [monitorDataLayer, setMonitorDataLayer] = useState(true);
  const [tableRows, setTableRows] = useState([
    { sku: "SKU-4577-736", product: "Sneakers", qty: 1, price: 123456.78, discount: 4568.90 }
  ]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("12:00");
  const [showOrderDate, setShowOrderDate] = useState(true);
  const [predictShippingCost, setPredictShippingCost] = useState(true);
  const [predictHandlingCost, setPredictHandlingCost] = useState(true);
  const [predictPaymentCost, setPredictPaymentCost] = useState(true);
  const [shippingCost, setShippingCost] = useState(0);
  const [handlingCost, setHandlingCost] = useState(0);
  const [paymentCost, setPaymentCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [autoPredict, setAutoPredict] = useState(false);
  const [shippingType, setShippingType] = useState("airmee");
  const [handlingType, setHandlingType] = useState("airmee");
  const [paymentType, setPaymentType] = useState("airmee");
  const [otherDiscountsType, setOtherDiscountsType] = useState("airmee");

  const [gp2plus, setGp2plus] = useState(0);

  useEffect(() => {
    const storedHeadwaiId = localStorage.getItem('headwaiId');
    if (storedHeadwaiId) {
      setHeadwaiId(storedHeadwaiId);
      setIsHeadwaiIdSet(true);
    }
  }, []);

  const handleReset = () => {
    setCustomer("");
    setMonitorDataLayer(true);
    setTableRows([{ sku: "", product: "", qty: 0, price: 0, discount: 0 }]);
    setDate(new Date());
    setTime("12:00");
    setShowOrderDate(true);
    setPredictShippingCost(true);
    setPredictHandlingCost(true);
    setPredictPaymentCost(true);
    setShippingCost(0);
    setHandlingCost(0);
    setPaymentCost(0);
    setAutoPredict(true);
    setShippingType("airmee");
    setHandlingType("airmee");
    setPaymentType("airmee");
    setOtherDiscountsType("airmee");
  };

  const handleClearHeadwaiId = () => {
    setHeadwaiId("");
    setIsHeadwaiIdSet(false);
    localStorage.removeItem('headwaiId');
  }

  const addProduct = () => {
    setTableRows([...tableRows, { sku: "", product: "", qty: 0, price: 0, discount: 0 }]);
  };

  const removeRow = (index) => {
    const newRows = tableRows.filter((_, i) => i !== index);
    setTableRows(newRows);
  };

  const updateRow = (index, field, value) => {
    const newRows = [...tableRows];
    newRows[index][field] = value;
    setTableRows(newRows);
  };

  const handleDateTimeChange = (newDate) => {
    setDate(newDate);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const formatDateTime = () => {
    if (!date) return "Pick a date and time";
    const dateString = format(date, "PPP");
    return `${dateString} ${time}`;
  };

  const handlePredict = async () => {
    setIsLoading(true);
    const requestData = {
      endpoint: headwaiId,
      customer,
      monitorDataLayer,
      products: tableRows,
      orderDate: showOrderDate ? new Date().toISOString() : `${format(date, "yyyy-MM-dd")}T${time}:00`,
      shipping: {
        cost: predictShippingCost ? null : shippingCost,
        predict: predictShippingCost,
        type: shippingType
      },
      handling: {
        cost: predictHandlingCost ? null : handlingCost,
        predict: predictHandlingCost,
        type: handlingType
      },
      payment: {
        cost: predictPaymentCost ? null : paymentCost,
        predict: predictPaymentCost,
        type: paymentType
      },
      otherDiscounts: {
        type: otherDiscountsType
      }
    };

    try {
      const response = await fetch('https://webhook.site/2fa325f7-e3f7-41f2-a502-cc1c75c8d899', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        mode: 'no-cors' // Add this line to use 'no-cors' mode
      });

      // Since 'no-cors' mode returns an opaque response, we can't check response.ok
      // We'll assume the request was successful if it doesn't throw an error
      setShowModal(true);
      toast.success("Prediction request sent successfully");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to send prediction request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGp2 = () => {
    const randomGp2plus = Math.random() * 100;
    setGp2plus(randomGp2plus);
  }

  const handleSetHeadwaiId = () => {
    if (headwaiId.trim()) {
      localStorage.setItem('headwaiId', headwaiId);
      setIsHeadwaiIdSet(true);
      toast.success("Headw.ai Id set successfully");
    } else {
      toast.error("Please enter a valid Headw.ai Id");
    }
  };

  const SearchableSelect = ({ value, onChange, options }) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : "Select..."}
            <Sparkles className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  if (!isHeadwaiIdSet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800">Enter Headw.ai Id</h2>
          <div className="space-y-2">
            <label htmlFor="headwaiId" className="text-sm font-medium text-gray-700">
              Headw.ai Id:
            </label>
            <Input
              id="headwaiId"
              type="text"
              placeholder="Enter your Headw.ai Id"
              value={headwaiId}
              onChange={(e) => setHeadwaiId(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSetHeadwaiId}
          >
            Set
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">

      <h1 className="text-xl font-semibold mb-4">Headw.ai Prediction Debugger</h1>

      <div className="flex items-center space-x-2">

      <Button variant="outline" onClick={handleClearHeadwaiId}>
          <X className="mr-2 h-4 w-4" />
          { headwaiId }
        </Button>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="icon"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset all fields</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Basket</h2>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="monitorDataLayer"
              checked={monitorDataLayer}
              onCheckedChange={setMonitorDataLayer}
            />
            <label htmlFor="monitorDataLayer" className="text-sm font-medium text-gray-700">
              Mirror DataLayer
            </label>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead className="w-[20%]">Qty</TableHead>
              <TableHead className="w-[20%]">Price</TableHead>
              <TableHead className="w-[20%]">Discount</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="w-[40%]">
                  <SearchableSelect
                    value={row.sku}
                    onChange={(value) => updateRow(index, 'sku', value)}
                    options={products.map(product => ({ value: product.sku, label: `${product.name} (${product.sku})` }))}
                  />
                </TableCell>
                <TableCell className="w-[20%]">
                  <Input
                    type="number"
                    value={row.qty}
                    onChange={(e) => updateRow(index, 'qty', parseInt(e.target.value))}
                  />
                </TableCell>
                <TableCell className="w-[20%]">
                  <Input
                    type="number"
                    value={row.price}
                    onChange={(e) => updateRow(index, 'price', parseFloat(e.target.value))}
                    step="0.1"
                  />
                </TableCell>
                <TableCell className="w-[20%]">
                  <Input
                    type="number"
                    value={row.discount}
                    onChange={(e) => updateRow(index, 'discount', parseFloat(e.target.value))}
                    step="0.1"
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => removeRow(index)} variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={addProduct} className="mt-4" variant="secondary">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col">
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">Customer:</label>
            <Input
              id="customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1"> Date:</label>
            {showOrderDate ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="runtime"
                  checked={showOrderDate}
                  onCheckedChange={() => setShowOrderDate(false)}
                />
                <label htmlFor="runtime" className="text-sm font-medium text-gray-700">
                  Use Current Time
                </label>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateTime()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateTimeChange}
                    initialFocus
                  />
                  <div className="p-3 border-t border-gray-200">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <Input
                        type="time"
                        value={time}
                        onChange={handleTimeChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 font-medium"></th>
              <th className="text-left text-sm p-2 font-medium">Shipping</th>
              <th className="text-left text-sm p-2 font-medium">Handling</th>
              <th className="text-left text-sm p-2 font-medium">Payment</th>
              <th className="text-left text-sm p-2 font-medium">Other Discounts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 font-medium text-right text-sm">Revenue</td>
              <td className="p-2">
                <Input type="number" defaultValue={0} step="0.01" className="w-full" />
              </td>
              <td className="p-2">
                <Input type="number" defaultValue={0} step="0.01" className="w-full" />
              </td>
              <td className="p-2">
                <Input type="number" defaultValue={0} step="0.01" className="w-full" />
              </td>
              <td className="p-2"></td>
            </tr>
            <tr>
              <td className="p-2 font-medium text-right text-sm">Cost</td>
              <td className="p-2">
                {predictShippingCost ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="predictShippingCost"
                      checked={predictShippingCost}
                      onCheckedChange={() => setPredictShippingCost(false)}
                    />
                    <label htmlFor="predictShippingCost" className="text-sm font-medium text-gray-700">
                      Predict
                    </label>
                  </div>
                ) : (
                  <Input
                    type="number"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(parseFloat(e.target.value))}
                    step="0.01"
                    className="w-full"
                  />
                )}
              </td>
              <td className="p-2">
                {predictHandlingCost ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="predictHandlingCost"
                      checked={predictHandlingCost}
                      onCheckedChange={() => setPredictHandlingCost(false)}
                    />
                    <label htmlFor="predictHandlingCost" className="text-sm font-medium text-gray-700">
                      Predict
                    </label>
                  </div>
                ) : (
                  <Input
                    type="number"
                    value={handlingCost}
                    onChange={(e) => setHandlingCost(parseFloat(e.target.value))}
                    step="0.01"
                    className="w-full"
                  />
                )}
              </td>
              <td className="p-2">
                {predictPaymentCost ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="predictPaymentCost"
                      checked={predictPaymentCost}
                      onCheckedChange={() => setPredictPaymentCost(false)}
                    />
                    <label htmlFor="predictPaymentCost" className="text-sm font-medium text-gray-700">
                      Predict
                    </label>
                  </div>
                ) : (
                  <Input
                    type="number"
                    value={paymentCost}
                    onChange={(e) => setPaymentCost(parseFloat(e.target.value))}
                    step="0.01"
                    className="w-full"
                  />
                )}
              </td>
              <td className="p-2">
                <Input type="number" defaultValue={0} step="0.01" className="w-full" />
              </td>
            </tr>
            <tr>
              <td className="p-2 font-medium text-right text-sm">Type</td>
              <td className="p-2">
                <SearchableSelect
                  value={shippingType}
                  onChange={setShippingType}
                  options={typeOptions}
                />
              </td>
              <td className="p-2">
                <SearchableSelect
                  value={handlingType}
                  onChange={setHandlingType}
                  options={typeOptions}
                />
              </td>
              <td className="p-2">
                <SearchableSelect
                  value={paymentType}
                  onChange={setPaymentType}
                  options={typeOptions}
                />
              </td>
              <td className="p-2">
                <SearchableSelect
                  value={otherDiscountsType}
                  onChange={setOtherDiscountsType}
                  options={typeOptions}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center space-x-4">
        <Button onClick={handlePredict} disabled={isLoading || autoPredict}>
          {isLoading ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Predict
        </Button>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="autoPredict"
            checked={autoPredict}
            onCheckedChange={setAutoPredict}
          />
          <label htmlFor="autoPredict" className="text-sm font-medium text-gray-700">
            Auto
          </label>
        </div>
        {/* <Button onClick={handleGp2}>Randomize GP2+</Button> */}
      </div>

      <div className="flex space-x-4">
        <div className="w-64 bg-white">
          <table className="w-full">
            <tbody>
              <tr className="bg-gray-50">
                <td className="p-3 text-sm font-medium">Cogs</td>
                <td className="p-3 text-sm text-right">123</td>
              </tr>
              <tr>
                <td className="p-3 text-sm font-medium">Shipping</td>
                <td className="p-3 text-sm text-right">123</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 text-sm font-medium">Handling</td>
                <td className="p-3 text-sm text-right">123</td>
              </tr>
              <tr>
                <td className="p-3 text-sm font-medium">Payment</td>
                <td className="p-3 text-sm text-right">123</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 text-sm font-medium">Return</td>
                <td className="p-3 text-sm text-right">123</td>
              </tr>
              <tr>
                <td className="p-3 text-sm font-medium">Future GP2</td>
                <td className="p-3 text-sm text-right">123</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="w-64 bg-white">
          <table className="w-full">
            <tbody>
              <tr className="bg-gray-50">
                <td className="p-3 text-sm font-medium">GP1</td>
                <td className="p-3 text-sm text-right">123</td>
              </tr>
              <tr>
                <td className="p-3 text-sm font-medium">GM1</td>
                <td className="p-3 text-sm text-right">10%</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 text-sm font-medium">GP2</td>
                <td className="p-3 text-sm text-right">123</td>
              </tr>
              <tr>
                <td className="p-3 text-sm font-medium">GM2</td>
                <td className="p-3 text-sm text-right">10%</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 text-sm font-medium">GP2+</td>
                <td className="p-3 text-sm text-right">
                  <FlashingValueDisplay value={gp2plus} formatValue={(v) => `$${v.toFixed(2)}`} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="w-64 bg-white">
          <table className="w-full">
            <tbody>
              <tr className="bg-gray-50">
                <td className="p-3 text-sm font-medium">Response Time</td>
                <td className="p-3 text-sm text-right">589ms</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* <JsonView src={ tableRows }/>
        <SearchableSelect
        options={frameworks}
        placeholder="Select framework..."
        emptyMessage="No framework found."
        onChange={(value) => console.log(value)}
      /> */}
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prediction Result</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Prediction request sent successfully. Check the webhook for details.</p>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Index;