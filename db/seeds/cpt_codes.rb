if CptCode.count.zero?

    cpt_codes = [
        {
            name: "CGM",
            codes: ["95249", "95250", "95251"]
        },
        {
            name: "E&M New Pt",
            codes: ["99202", "99203", "99204", "99205"]
        },
        {
            name: "E&M Est Pt",
            codes: ["99211", "99212", "99213", "99214", "99215"]
        },
        {
            name: "RPM",
            codes: ["99453", "99454", "99457", "99458", "99091"]
        },
        {
            name: "RTM",
            codes: ["98975", "98976", "98977","98980", "98981"]
        },
        {
            name: "CCM",
            codes: ["99490", "G2058", "99487", "99489"]
        },
        {
            name: "TCM",
            codes: ["99495", "99496"]
        },
        {
            name: "Smoking",
            codes: ["99406", "99407"]
        },
        {
            name: "Anticoag",
            codes: ["93792", "93793"]
        },
        {
            name: "MTM",
            codes: ["99605", "99606", "99607"]
        },
        {
            name: "NDPP",
            codes: ["G9873-79", "G9880-85", "G9890", "G9891"]
        },
        {
            name: "DSMT",
            codes: ["G0108", "G0109"]
        },
        {
            name: "Covid vacc",
            codes: ["91300"]
        },
    ]
    
    cpt_codes.each do |cpt_code|
        cpt_code[:codes].each do |code|
            CptCode.create!(
                name: cpt_code[:name],
                code: code
            )
        end
    end
end