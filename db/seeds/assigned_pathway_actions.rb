if AssignedPathwayWeek.count.zero?
    assigned_pathway = AssignedPathway.first
    assigned_pathway_week = AssignedPathwayWeek.create!(
        assigned_pathway: assigned_pathway,
        name: "Assigned Pathway week 1",
        start_date: Date.today
    )
    AssignedPathwayWeekAction.create!(
        assigned_pathway_week: assigned_pathway_week,
        text: "Assigned Action 1",
        subtext: "Assigned action sutext",
        recurring: true,
        status: "unassigned"
    )

    assigned_pathway = AssignedPathway.second
    assigned_pathway_week = AssignedPathwayWeek.create!(
        assigned_pathway: assigned_pathway,
        name: "Assigned Pathway week 2",
        start_date: Date.today
    )
    AssignedPathwayWeekAction.create!(
        assigned_pathway_week: assigned_pathway_week,
        text: "Assigned Action 2",
        subtext: "Assigned action sutext",
        recurring: true,
        status: "unassigned"
    )
    AssignedPathwayWeekAction.create!(
        assigned_pathway_week: assigned_pathway_week,
        text: "Assigned Action 3",
        subtext: "Assigned action sutext",
        recurring: true,
        status: "unassigned"
    )

    assigned_pathway = AssignedPathway.third
    assigned_pathway_week = AssignedPathwayWeek.create!(
        assigned_pathway: assigned_pathway,
        name: "Assigned Pathway week 3",
        start_date: Date.today
    )
    AssignedPathwayWeekAction.create!(
        assigned_pathway_week: assigned_pathway_week,
        text: "Assigned Action 4",
        subtext: "Assigned action sutext",
        recurring: true,
        status: "unassigned"
    )
    AssignedPathwayWeekAction.create!(
        assigned_pathway_week: assigned_pathway_week,
        text: "Assigned Action 5",
        subtext: "Assigned action sutext",
        recurring: true,
        status: "unassigned"
    )

end