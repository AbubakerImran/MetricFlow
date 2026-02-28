"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FolderOpen, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const PROJECT_COLORS = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", "#14B8A6", "#6366F1"];

const initialProjects = [
  { id: "1", name: "Marketing Website", description: "Main marketing site analytics", color: "#3B82F6", events: 12450, revenue: 48290 },
  { id: "2", name: "Mobile App", description: "iOS and Android app tracking", color: "#10B981", events: 8320, revenue: 22150 },
  { id: "3", name: "E-Commerce Store", description: "Online store conversion tracking", color: "#8B5CF6", events: 15680, revenue: 89430 },
  { id: "4", name: "SaaS Platform", description: "Product usage analytics", color: "#F59E0B", events: 6790, revenue: 15680 },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", color: PROJECT_COLORS[0] });

  const handleCreate = () => {
    if (!newProject.name.trim()) { toast.error("Project name is required"); return; }
    const project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      color: newProject.color,
      events: 0,
      revenue: 0,
    };
    setProjects([...projects, project]);
    setNewProject({ name: "", description: "", color: PROJECT_COLORS[0] });
    setDialogOpen(false);
    toast.success("Project created");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-muted-foreground">{projects.length} projects</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700"><Plus className="mr-2 h-4 w-4" />Create Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Project</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="My Project" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Project description..." />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {PROJECT_COLORS.map((color) => (
                    <button key={color} onClick={() => setNewProject({ ...newProject, color })}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${newProject.color === color ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">Create your first project to start tracking events.</p>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Create Project</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:shadow-md transition-all duration-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
                  <CardTitle className="text-base">{project.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Events</p>
                    <p className="font-semibold">{project.events.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-semibold">${project.revenue.toLocaleString()}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4 group-hover:bg-accent" asChild>
                  <Link href={`/dashboard/projects/${project.id}`}>View Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
