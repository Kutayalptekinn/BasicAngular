import { ListService, PagedResultDto } from '@abp/ng.core';
import { ConfirmationService,Confirmation } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LectureDto, LectureService } from '@proxy/lectures';
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss'],
  providers: [ListService, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }],
})
export class LectureComponent implements OnInit {

  lecture = { items: [], totalCount: 0 } as PagedResultDto<LectureDto>;
  form: FormGroup;
  selectedLecture = {} as LectureDto;
  isModalOpen = false;
  
  
  constructor(
    public readonly list: ListService,
    private lectureService: LectureService,
    private fb: FormBuilder,
    private confirmation: ConfirmationService
  ) { }

  ngOnInit() {
    const lectureStreamCreator = (query) => this.lectureService.getList(query);

    this.list.hookToQuery(lectureStreamCreator).subscribe((response) => {
      this.lecture = response;
    });
    
  }

  createLecture()
  {
    this.selectedLecture = {} as LectureDto;
    this.buildForm();
    this.isModalOpen = true;
  }

  editLecture(id: string) {
    this.lectureService.get(id).subscribe((lecture) => {
      this.selectedLecture = lecture;
      this.buildForm();
      this.isModalOpen = true;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      lectureName: [this.selectedLecture.lectureName || null, Validators.required],
      lectureCode: [this.selectedLecture.lectureCode || null, Validators.required],
      totalCapacity: [this.selectedLecture.totalCapacity || null, Validators.required],
      totalCredit: [this.selectedLecture.totalCredit || null, Validators.required],
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedLecture.id ? this.lectureService.update(this.selectedLecture.id, this.form.value) : this.lectureService.create(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }

  deleteLecture(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', 'AbpAccount::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.lectureService.delete(id).subscribe(() => this.list.get());
      }
    });
  }

}
