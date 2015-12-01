package edu.valpo;

import edu.valpo.objects.Dosage;
import edu.valpo.objects.Prescription;
import edu.valpo.objects.Schedule;
import edu.valpo.repository.DosageRepository;
import edu.valpo.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by jszaday on 11/30/2015.
 */
@RestController
public class ScheduleController {

    @Autowired
    private DosageRepository dosageRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @RequestMapping("/schedule")
    public Schedule schedule() {
        Schedule s = new Schedule();
        Iterable<Dosage> activeDosages = dosageRepository.findEnabled();

        for (Dosage d: activeDosages) {

        }

        return s;
    }
}
