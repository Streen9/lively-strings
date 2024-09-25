import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProductCreationDashboard from "./AdminProductCreationDashboard";
import AdminProductManagement from "./AdminProductManagementDashboard";
const AdminDashboard: React.FC = () => {
  return (
    <Tabs defaultValue="manage">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manage">Manage Products</TabsTrigger>
        <TabsTrigger value="create">Create Product</TabsTrigger>
      </TabsList>

      <TabsContent value="manage">
        <AdminProductManagement />
      </TabsContent>

      <TabsContent value="create">
        <AdminProductCreationDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default AdminDashboard;
