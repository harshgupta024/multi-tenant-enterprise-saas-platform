import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Team, CreateTeamRequest, UpdateTeamRequest } from '@shared/types';
import { getTenantId } from '../../../context/index.js';

// In-memory mock data
let mockTeams: Team[] = [
  {
    id: 'mock-team-1',
    tenantId: 'mock-tenant-id',
    name: 'Engineering',
    description: 'Software development team',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export class TeamsController {
  
  /**
   * Get all teams for the current tenant
   */
  async getTeams(req: Request, res: Response) {
    const tenantId = getTenantId();
    const teams = mockTeams.filter(t => t.tenantId === tenantId);
    
    res.json({
      data: teams,
      meta: { total: teams.length }
    });
  }

  /**
   * Get a specific team by ID
   */
  async getTeamById(req: Request, res: Response) {
    const tenantId = getTenantId();
    const teamId = req.params.id;
    
    const team = mockTeams.find(t => t.id === teamId && t.tenantId === tenantId);
    
    if (!team) {
      return res.status(404).json({ error: 'Not Found', message: 'Team not found' });
    }
    
    res.json({ data: team });
  }

  /**
   * Create a new team
   */
  async createTeam(req: Request, res: Response) {
    const tenantId = getTenantId();
    const payload: CreateTeamRequest = req.body;
    
    const newTeam: Team = {
      id: uuidv4(),
      tenantId,
      name: payload.name,
      description: payload.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockTeams.push(newTeam);
    
    res.status(201).json({ data: newTeam });
  }

  /**
   * Update an existing team
   */
  async updateTeam(req: Request, res: Response) {
    const tenantId = getTenantId();
    const teamId = req.params.id;
    const payload: UpdateTeamRequest = req.body;
    
    const index = mockTeams.findIndex(t => t.id === teamId && t.tenantId === tenantId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: 'Team not found' });
    }
    
    const updatedTeam = {
      ...mockTeams[index],
      ...payload,
      updatedAt: new Date(),
    };
    
    mockTeams[index] = updatedTeam;
    
    res.json({ data: updatedTeam });
  }

  /**
   * Delete a team
   */
  async deleteTeam(req: Request, res: Response) {
    const tenantId = getTenantId();
    const teamId = req.params.id;
    
    const index = mockTeams.findIndex(t => t.id === teamId && t.tenantId === tenantId);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Not Found', message: 'Team not found' });
    }
    
    mockTeams.splice(index, 1);
    
    res.status(204).send();
  }
}
